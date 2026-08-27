import assert from 'node:assert/strict'
import test from 'node:test'
import { configureStore } from '@reduxjs/toolkit'
import reducer, { runLabPlayback, setActiveLab } from '../src/features/lab/labSlice.js'

test('lab view state switches the active lab', () => {
  let state = reducer(undefined, { type: 'init' })
  state = reducer(state, setActiveLab('estimator'))

  assert.equal(state.activeLab, 'estimator')
  assert.deepEqual(state.playback, { status: 'idle', step: -1, totalSteps: 0, runId: 1 })
})

test('lab playback visits every stage and completes', async () => {
  const store = configureStore({ reducer: { lab: reducer } })

  await store.dispatch(runLabPlayback({ totalSteps: 4, delay: 0 }))

  assert.deepEqual(store.getState().lab.playback, {
    status: 'complete',
    step: 3,
    totalSteps: 4,
    runId: 1
  })
})
