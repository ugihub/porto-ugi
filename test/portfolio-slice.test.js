import assert from 'node:assert/strict'
import test from 'node:test'
import reducer, { selectProject, setActiveTab } from '../src/features/portfolio/portfolioSlice.js'

test('project view state selects a project and switches tabs', () => {
  let state = reducer(undefined, { type: 'init' })
  state = reducer(state, setActiveTab('archive'))
  state = reducer(state, selectProject('warehouseflow'))

  assert.deepEqual(state, { activeTab: 'archive', selectedProjectId: 'warehouseflow' })
})
