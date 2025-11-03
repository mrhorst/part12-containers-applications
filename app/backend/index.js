const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = app.listen(config.PORT, (err) => {
  if (err) {
    logger.error('Server error:', err)
    process.exit(1)
  }
  logger.info(`Server running on port ${config.PORT}`)
})
