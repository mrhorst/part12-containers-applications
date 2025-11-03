const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'MongoNotConnectedError') {
    return response.status(400).json({ error: error.message })
  }

  logger.error('OUR MIDDLEWARE DID NOT CATCH THIS ONE. PLEASE FIX:')
  logger.error('Name: ', error.name)
  logger.error('Error: ', error)

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (request, response, next) => {
  try {
    if (request.token) {
      const decodedUser = jwt.verify(request.token, process.env.SECRET)
      if (decodedUser) {
        request.user = decodedUser
      }
    }
  } catch (e) {
    next(e)
  } //
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
