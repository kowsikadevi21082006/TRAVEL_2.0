<<<<<<< HEAD
import 'dotenv/config'
=======
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
import { app } from './app.js'
import { logger } from './logger.js'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
