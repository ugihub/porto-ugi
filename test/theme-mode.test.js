import assert from 'node:assert/strict'
import test from 'node:test'

let getThemeMode

try {
  ({ getThemeMode } = await import('../src/contexts/themeMode.js'))
} catch {
  getThemeMode = undefined
}

test('classifies preset backgrounds for chatbot message contrast', () => {
  assert.equal(typeof getThemeMode, 'function')
  assert.equal(getThemeMode('#0a0a0a'), 'dark')
  assert.equal(getThemeMode('#0f172a'), 'dark')
  assert.equal(getThemeMode('#ffffff'), 'light')
  assert.equal(getThemeMode('#e1f5fe'), 'light')
})
