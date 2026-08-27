import assert from 'node:assert/strict'
import test from 'node:test'
import * as labEngine from '../src/features/lab/labEngine.js'
import { estimateModelCost, estimateTokens, evaluateReliability, rankDocuments } from '../src/features/lab/labEngine.js'

test('maps playback steps to bounded WarehouseFlow delivery stops', () => {
  assert.deepEqual(labEngine.getDeliveryPosition?.(-1), { left: 5, top: 72, rotate: 0 })
  assert.deepEqual(labEngine.getDeliveryPosition?.(2), { left: 50, top: 72, rotate: 18 })
  assert.deepEqual(labEngine.getDeliveryPosition?.(99), { left: 94, top: 72, rotate: 18 })
})

test('estimates non-empty prompt tokens with the documented local heuristic', () => {
  assert.equal(estimateTokens('12345678'), 2)
  assert.equal(estimateTokens('   '), 0)
})

test('ranks matching local retrieval documents first', () => {
  const ranked = rankDocuments('wallet withdrawal', [
    { id: 'wallet', text: 'Wallet balance and withdrawal approval workflow.' },
    { id: 'pickup', text: 'Pickup requests for recyclable waste.' }
  ])
  assert.deepEqual(ranked.map((item) => item.id), ['wallet', 'pickup'])
})

test('requires evidence before allowing a high-risk action', () => {
  assert.deepEqual(
    evaluateReliability({ schemaValid: true, risk: 'high', evidence: [] }),
    { status: 'evidence-required', reason: 'High-risk actions require evidence before execution.' }
  )
})

test('calculates USD and IDR from separate input and output rates', () => {
  assert.deepEqual(
    estimateModelCost({ inputTokens: 1460, outputTokens: 250 }, { inputPerMillion: 1, outputPerMillion: 4 }, 16000),
    { usd: 0.00246, idr: 39.36 }
  )
})
