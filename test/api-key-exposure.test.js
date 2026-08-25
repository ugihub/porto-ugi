import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import test from 'node:test'

const root = fileURLToPath(new URL('..', import.meta.url))

const readJavaScriptFiles = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return readJavaScriptFiles(filePath)
    return entry.name.endsWith('.js') ? [readFileSync(filePath, 'utf8')] : []
  })

test('production browser bundle keeps the Mistral key server-side', () => {
  const browserOnlySecret = 'browser-test-only-secret'

  execFileSync(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
    cwd: root,
    env: { ...process.env, VITE_MISTRAL_API_KEY: browserOnlySecret },
    stdio: 'pipe'
  })

  const bundle = readJavaScriptFiles(path.join(root, 'dist')).join('\n')
  assert.doesNotMatch(bundle, new RegExp(browserOnlySecret))
  assert.doesNotMatch(bundle, /api\.mistral\.ai/)
})
