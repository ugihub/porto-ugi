import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'

const readJsonBody = (req) => new Promise((resolve, reject) => {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    if (!body) {
      resolve({})
      return
    }

    try {
      resolve(JSON.parse(body))
    } catch (error) {
      reject(error)
    }
  })

  req.on('error', reject)
})

const createVercelResponse = (res) => ({
  status(code) {
    res.statusCode = code
    return this
  },
  json(payload) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
    }
    res.end(JSON.stringify(payload))
    return this
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.MISTRAL_API_KEY ||= env.MISTRAL_API_KEY
  process.env.MISTRAL_MODEL ||= env.MISTRAL_MODEL

  return {
    plugins: [
      react(),
      {
        name: 'local-chat-api',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            try {
              req.body = await readJsonBody(req)
              await chatHandler(req, createVercelResponse(res))
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON request body' }))
            }
          })
        }
      }
    ],
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            animations: ['framer-motion', 'gsap']
          }
        }
      }
    },
    server: {
      port: 5173,
      open: true,
    }
  }
})
