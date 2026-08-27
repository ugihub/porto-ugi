import assert from 'node:assert/strict'
import test from 'node:test'
import { parseActions } from '../src/features/chatbot/actions.js'

test('chatbot action parser removes supported lab action tags from visible text', () => {
  const result = parseActions('Open the lab. [ACTION:navigate:playground] [ACTION:ptab:estimator]')
  assert.equal(result.cleanText, 'Open the lab.')
  assert.deepEqual(result.actions, [
    { type: 'navigate', target: 'playground' },
    { type: 'ptab', target: 'estimator' }
  ])
})
