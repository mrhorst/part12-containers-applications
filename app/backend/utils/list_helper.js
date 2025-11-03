const User = require('../models/user')
const Blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    acc += cur.likes
    return acc
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, cur) => {
    acc = acc.likes > cur.likes ? acc : cur
    return acc
  }, 0)
}

const leastFavorite = (blogs) => {
  return blogs.reduce((acc, cur) => (acc.likes < cur.likes ? acc : cur), 0)
}

const authorWithMostBlogs = (blogs) => {
  const blogsPerAuthor = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + 1
    return acc
  }, {})

  const arrayOfAuthors = Object.entries(blogsPerAuthor)

  const [author, blogsCount] = arrayOfAuthors.reduce((max, cur) => {
    return cur[1] > max[1] ? cur : max
  })

  return { author, blogs: blogsCount }
}

const authorWithMostLikes = (blogs) => {
  const likesPerAuthor = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + cur.likes
    return acc
  }, {})

  const arrayWithLikes = Object.entries(likesPerAuthor)

  const [author, likes] = arrayWithLikes.reduce((max, cur) => {
    return max[1] > cur[1] ? max : cur
  })

  return { author, likes }
}

/** Users */

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  leastFavorite,
  usersInDb,
  blogsInDb,
  authorWithMostBlogs,
  authorWithMostLikes,
}
