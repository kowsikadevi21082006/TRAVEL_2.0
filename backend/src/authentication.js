// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'

export const authentication = (app) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)

  // In-memory attempt store: key -> { count, first }
  // Key is constructed from IP + identifier (email/username)
  const attemptStore = new Map()
  const WINDOW_MS = parseInt(process.env.AUTH_RATE_WINDOW_MS || String(15 * 60 * 1000), 10) // default 15 minutes
  const MAX_ATTEMPTS = parseInt(process.env.AUTH_RATE_MAX || '5', 10) // default 5 attempts

  app.service('authentication').hooks({
    before: {
      create: [
        async (context) => {
          const { data = {}, params = {} } = context
          const strategy = data.strategy || ''
          if (strategy !== 'local') return context

          const ip = (params.headers && (params.headers['x-forwarded-for'] || params.headers['x-real-ip'])) || params.ip || (params.connection && params.connection.remoteAddress) || 'unknown'
          const identifier = data.email || data.username || 'unknown'
          const key = `${ip}:${identifier}`

          const now = Date.now()
          const entry = attemptStore.get(key)
          if (entry && now - entry.first < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
            const err = new Error('Too many authentication attempts, try again later')
            err.code = 429
            throw err
          }

          if (!entry || now - entry.first >= WINDOW_MS) {
            attemptStore.set(key, { count: 1, first: now })
          } else {
            attemptStore.set(key, { count: entry.count + 1, first: entry.first })
          }

          return context
        }
      ]
    },
    after: {
      create: [
        async (context) => {
          // On successful authentication reset attempts for this key
          const { data = {}, params = {} } = context
          const strategy = data.strategy || ''
          if (strategy !== 'local') return context
          const ip = (params.headers && (params.headers['x-forwarded-for'] || params.headers['x-real-ip'])) || params.ip || (params.connection && params.connection.remoteAddress) || 'unknown'
          const identifier = data.email || data.username || 'unknown'
          const key = `${ip}:${identifier}`
          attemptStore.delete(key)
          return context
        }
      ]
    },
    error: {
      create: [
        // failed auth goes through 'before' increment logic; nothing needed here
        async (context) => context
      ]
    }
  })
}