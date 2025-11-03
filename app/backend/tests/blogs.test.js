const { before, test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const { app, dbReady } = require('../app')

const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

before(async () => {
  await dbReady
})

describe("When there's initially 6 blogs in the db..", async () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
  })

  test('the initial list of blogs have a total of 36 likes..', async () => {
    const initialBlogs = await listHelper.blogsInDb()
    const totalLikes = await listHelper.totalLikes(initialBlogs)
    assert.strictEqual(totalLikes, 36)
  })

  test('author with most blogs', async () => {
    const initialBlogs = await listHelper.blogsInDb()
    const authorWithMostBlogs = listHelper.authorWithMostBlogs(initialBlogs)
    assert.deepStrictEqual(authorWithMostBlogs, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('author with most likes', async () => {
    const initialBlogs = await listHelper.blogsInDb()
    const authorWithMostLikes = listHelper.authorWithMostLikes(initialBlogs)
    assert.deepStrictEqual(authorWithMostLikes, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('return the favorite blog, which is the one with most likes (12)', async () => {
    const initialBlogs = await listHelper.blogsInDb()
    const favoriteBlog = listHelper.favoriteBlog(initialBlogs)
    assert.deepStrictEqual(favoriteBlog.likes, 12)
  })

  test('return 0 if list of blogs is empty', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, 0)
  })

  test('return the least favorite blog', async () => {
    const initialBlogs = await listHelper.blogsInDb()
    const leastFavorite = listHelper.leastFavorite(initialBlogs)
    assert.deepStrictEqual(leastFavorite.likes, blogs[4].likes)
  })
})

describe('When sending HTTP requests...', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)

    const passwordHash = await bcrypt.hash('secret', 10)
    const root = await new User({ username: 'root', passwordHash }).save()

    await Blog.updateMany(
      { $or: [{ user: null }, { user: { $exists: false } }] },
      { $set: { user: root._id.toString() } }
    )

    const ownedBlogs = await Blog.find({ user: root._id.toString() }).select(
      '_id'
    )

    const blogIds = ownedBlogs.map((b) => b._id)

    await User.updateOne({ _id: root._id }, { $set: { blogs: blogIds } })
  })
  test('GET returns the correct amount of blog posts', async () => {
    const allBlogsFromDb = await Blog.find({})

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, allBlogsFromDb.length)
  })

  test('prop id is the unique identifier for blogs', async () => {
    const response = await api.get('/api/blogs').expect(200)

    const blog = response.body[0]

    assert.ok('id' in blog, 'id NOT present in blogs')
    assert.ok(!('_id' in blog), '_id IS present in blog')
  })

  test('POST to /api/blogs WITHOUT Auth Token FAILS', async () => {
    const blog = {
      title: 'Created from test',
      author: 'mrhorst',
      url: 'frompost.com',
      likes: 2,
    }
    const blogsBeforePost = await api.get('/api/blogs')
    await api.post('/api/blogs').send(blog).expect(401)
    const blogsAfterPost = await api.get('/api/blogs')

    const lengthBefore = blogsBeforePost.body.length
    const lengthAfter = blogsAfterPost.body.length

    assert.strictEqual(lengthAfter, lengthBefore)
  })

  test('POST to /api/blogs WITH Auth Token creates a new blog', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blog = {
      title: 'Created from test',
      author: 'mrhorst',
      url: 'frompost.com',
      likes: 2,
    }
    const blogsBeforePost = await api.get('/api/blogs')
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)

    const blogsAfterPost = await api.get('/api/blogs')

    const lengthBefore = blogsBeforePost.body.length
    const lengthAfter = blogsAfterPost.body.length

    assert.strictEqual(lengthAfter, lengthBefore + 1)
  })

  test('if the prop `likes` is missing from the request, default to 0', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blog = {
      title: 'blog without likes prop',
      author: 'likeless author',
      url: 'nolikes.com',
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
    assert.strictEqual(response.body.likes, 0)
  })

  test('if the prop `likes` is present in request, keep it', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blog = {
      title: 'blog with likes prop',
      author: 'liked author',
      url: 'yeslikes.com',
      likes: 3,
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)

    assert.strictEqual(response.body.likes, blog.likes)
  })

  test('if title is missing, return 400', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blog = {
      author: 'author without title',
      url: 'notitle.com',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)
  })

  test('if url is missing, return 400', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blog = {
      title: 'no url',
      author: 'author without url',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(400)
  })

  test('authenticated user can NOT delete a blog post if not owner', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token

    const blogs = await api.get('/api/blogs')
    const firstBlog = blogs.body[0]
    const blog = await Blog.findById(firstBlog.id)
    blog.user = undefined
    await blog.save()

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
  })

  test('authenticated user CAN delete a blog post if owner', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token
    const username = loginResponse.body.username

    const blogs = await api.get('/api/blogs')

    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    assert.deepEqual(blogs.body[0].user.username, username)
  })

  test('we can NOT update the "likes" prop of a blog post if not authenticated', async () => {
    const blogs = await api.get('/api/blogs')
    const firstBlog = blogs.body[0]
    firstBlog.likes += 1
    await api.put(`/api/blogs/${firstBlog.id}`).send(firstBlog).expect(401)
  })

  test('we CAN update the "likes" prop of a blog post if authenticated', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const token = loginResponse.body.token
    const username = loginResponse.body.username

    const user = await User.find({ username })

    const response = await api.get('/api/blogs')

    const blogs = response.body

    const blog = blogs.find((b) => {
      const userId = b.user.id
      const userFoundInDb = user[0]
      return userId === userFoundInDb._id.toString()
    })

    blog.likes += 1

    await api
      .put(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
      .expect(201)
  })
})

after(async () => {
  await mongoose.connection.close()
})
