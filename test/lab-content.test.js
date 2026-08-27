import assert from 'node:assert/strict'
import test from 'node:test'
import { getLabTab, labTabs } from '../src/data/appliedAiLabContent.js'

test('unknown lab IDs fall back to the WarehouseFlow lab', () => {
  assert.equal(getLabTab('unknown').id, 'warehouse')
})

test('all lab tabs define label and premise', () => {
  for (const tab of labTabs) {
    assert.ok(tab.id)
    assert.ok(tab.label)
    assert.ok(tab.premise)
  }
})
