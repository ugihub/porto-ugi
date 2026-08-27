import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWarehouseflowRequest, validateLivePrompt } from '../api/lib/warehouseflowLive.js'

test('live WarehouseFlow prompt validation trims and caps input at 1,000 characters', () => {
  assert.deepEqual(validateLivePrompt('  check A-17  '), { ok: true, prompt: 'check A-17' })
  assert.equal(validateLivePrompt(' ').ok, false)
  assert.deepEqual(validateLivePrompt('x'.repeat(1001)), { ok: false, error: 'Prompt must be 1000 characters or fewer.' })
})

test('live WarehouseFlow request keeps fixed generation limits and generic tools', () => {
  const request = buildWarehouseflowRequest('check stock for A-17')
  assert.equal(request.max_tokens, 256)
  assert.equal(request.temperature, 0)
  assert.equal(request.messages.at(-1).content, 'check stock for A-17')
  assert.equal(request.tools[0].function.name, 'inventory_lookup')
})
