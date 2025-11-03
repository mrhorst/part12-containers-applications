const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = new Blog(request.body)

  if (!request.user) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const authenticatedUser = request.user
  // console.log(user)
  const user = await User.findById(authenticatedUser.id)

  if (!body.title) {
    response.status(400).send({ error: 'title is missing' })
  }

  if (!body.url) {
    response.status(400).send({ error: 'url is missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.user) {
      return response.status(401).json({ error: 'invalid token' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog.user) {
      return response.status(500).json({ error: 'this blog has no owner' })
    }

    const blogOwner = blog.user._id.toString()

    if (blogOwner !== request.user.id) {
      return response
        .status(403)
        .json({ error: 'you do not own this resource' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const { likes, url, author, title } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
