// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'

import { authentication } from './authentication.js'

import { services } from './services/index.js'

import path from 'path'

const app = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))
// app.use('/', express.static(path.join(__dirname, '../build')));

<<<<<<< HEAD
// Allow overriding MongoDB connection via environment variable for local runs
const envMongoRaw = process.env.MONGODB_URI || process.env.MONGODB
// Safety: avoid accidentally using unrelated env values (like API keys) as Mongo URI
const envMongo = (typeof envMongoRaw === 'string' && !envMongoRaw.startsWith('csk-')) ? envMongoRaw : null
if (envMongo) {
  app.set('mongodb', envMongo)
} else {
  // clear configured value so mongodb.js can fall back to an in-memory server
  app.set('mongodb', null)
  if (envMongoRaw && envMongoRaw.startsWith && envMongoRaw.startsWith('csk-')) {
    logger && logger.warn && logger.warn('Ignored MONGODB env value because it looks like an API key')
  }
}

import { systemPrompt } from './customerCarePrompt.js'

// Customer care proxy endpoint to forward requests to Cerebras (server-side)
// Requires environment variables: CEREBRAS_API_KEY and optionally CEREBRAS_API_URL
app.post('/api/v1/customer-care', async (req, res) => {
  try {
    const apiKey = process.env.CEREBRAS_API_KEY
    const apiUrl = process.env.CEREBRAS_API_URL || 'https://api.cerebras.example/v1/generate'
    const userMessage = req.body.message || req.body.prompt || req.body.input || ''

    const lower = userMessage.toLowerCase()

    // --- Hardcoded helpful responses for core questions ---
    if (lower.includes('book') || lower.includes('booking') || lower.includes('how to')) {
      return res.json({
        reply: "To book a tour with us, please follow these steps:\n1. **Log in or Sign up** for an account.\n2. **Explore** packages on our 'Tours' page to decide where you'd like to go.\n3. **Select** your preferred tour and click the **'Book Now'** button.\n4. Complete the payment process to confirm your reservation!",
        questions: ['What destinations do you have?', 'What are the current prices?', 'Tell me more aboutBali']
      })
    }
    
    if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) {
      return res.json({
        reply: "Our tour prices vary depending on the destination and duration. Generally, packages start from $500. You can see the exact pricing for each tour on its detail page. We also offer seasonal discounts!",
        questions: ['How do I book a tour?', 'Are there any discounts?', 'Show me budget tours']
      })
    }
    // -----------------------------------------------------

    if (!apiKey || apiUrl.includes('example')) {
      // For general questions without API setup
      let reply = ""
      let questions = []

      if (lower.includes('destination') || lower.includes('show') || lower.includes('where')) {
        reply = "We offer a wide range of destinations including exotic beaches, mountain treks, and cultural city tours. Some of our popular spots are Bali, the Swiss Alps, and Tokyo!"
        questions = ['Tell me about Bali', 'Do you have mountain tours?', 'Which tours are trending?']
      } else {
        reply = `Hi! I'm your Tourism Assistant. You asked: "${userMessage}". Since the AI connection is currently in demo mode, I can help you with booking steps or general info. What would you like to know?`
        questions = ['How do I book a tour?', 'What are the current prices?', 'Show me destinations']
      }

      return res.json({ demo: true, reply, questions })
    }

    // Debug: log what we're about to call (do not log full API key)
    console.log('customer-care: calling remote', {
      apiUrl: String(apiUrl).slice(0, 200),
      hasApiKey: !!apiKey,
      apiKeyPreview: apiKey && apiKey.slice(0, 6) + '...' 
    })

    // Prepare payload. Many LLM APIs (including Cerebras chat) support 'messages' or 'prompt'
    // If it's a chat-completion style endpoint, we use messages.
    const isChatEndpoint = apiUrl.includes('chat') || apiUrl.includes('completions')
    const body = isChatEndpoint 
      ? {
          model: 'llama3-70b', // Default or from env
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        }
      : { 
          input: userMessage,
          system_prompt: systemPrompt 
        }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: text })
    }

    const data = await response.json()
    // Extract reply based on common response formats
    const reply = data.choices ? data.choices[0].message.content : (data.reply || data.response || data.text || JSON.stringify(data))
    
    return res.json({ ...data, reply })
  } catch (err) {
    // Log full error for debugging
    console.error(err)
    if (err && err.stack) console.error(err.stack)
    return res.status(500).json({ error: err.message })
  }
})

=======
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3

// Configure services and real-time functionality
app.configure(rest("/api/v1"))

app.configure(mongodb)




app.configure(authentication)

app.configure(services)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// })

export { app }
