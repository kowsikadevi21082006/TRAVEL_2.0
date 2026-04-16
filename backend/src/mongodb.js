// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { MongoClient } from 'mongodb'

<<<<<<< HEAD
// Fallback to an in-memory MongoDB when no connection is configured
export const mongodb = (app) => {
  // Create a promise immediately and set it on the app so services can use it.
  const dbPromise = (async () => {
    // Prefer configured app value, then environment variables.
    let connection = app.get('mongodb')
    // Defensive: ignore values that look like API keys
    if (connection && typeof connection === 'string' && connection.startsWith('csk-')) {
      connection = null
    }
    const envConn = process.env.MONGODB_URI || process.env.MONGODB
    // If app did not provide a connection and envConn looks like a real URI, use it.
    if (!connection && envConn && typeof envConn === 'string' && !envConn.startsWith('csk-')) {
      connection = envConn
    }

    if (!connection) {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create()
        connection = mongoServer.getUri()
        app.set('mongodbMemoryServer', mongoServer)
        app.logger && app.logger.info && app.logger.info('Started in-memory MongoDB')
      } catch (err) {
        throw new Error('No mongodb connection configured and failed to start in-memory MongoDB: ' + err.message)
      }
    }

    let database
    try {
      database = new URL(connection).pathname.substring(1)
    } catch (err) {
      // Improve error message and guard against accidentally passing API keys
      const msg = `Failed to parse MongoDB connection as a URL: ${err.message}`
      app.logger && app.logger.error && app.logger.error(msg, { connection: String(connection).slice(0, 64) })
      // If the connection looks like an API key, give a clearer hint
      if (typeof connection === 'string' && connection.startsWith('csk-')) {
        throw new Error('MongoDB connection appears to be an API key (starts with "csk-"). Check your environment variables and .env file.')
      }
      // As a last resort try to extract the database name after the last '/'
      const parts = String(connection).split('/')
      database = parts[parts.length - 1] || undefined
      if (!database) {
        throw new Error(msg)
      }
    }

    const client = await MongoClient.connect(connection)
    return client.db(database)
  })()

  app.set('mongodbClient', dbPromise)
=======
export const mongodb = (app) => {
  const connection = app.get('mongodb')
  const database = new URL(connection).pathname.substring(1)
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))

  app.set('mongodbClient', mongoClient)
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
}
