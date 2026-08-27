import assert from 'node:assert/strict'
import test from 'node:test'
import * as content from '../src/data/portfolioContent.js'

const { featuredProjects, getProjectsForTab, portfolioPositioning, toolGroups, verifiedCredentials } = content

test('private project records never expose public source links', () => {
  for (const project of featuredProjects.filter((item) => item.visibility === 'private')) {
    assert.deepEqual(project.publicLinks, [])
  }
})

test('featured AI view contains the approved project order', () => {
  assert.deepEqual(
    getProjectsForTab('ai').map((project) => project.id),
    ['warehouseflow', 'cuanlimbah', 'long-horizon-task', 'mt5-tradeai']
  )
})

test('WarehouseFlow is public with its approved Hugging Face link', () => {
  const warehouseFlow = featuredProjects.find((project) => project.id === 'warehouseflow')

  assert.equal(warehouseFlow.visibility, 'public')
  assert.deepEqual(warehouseFlow.publicLinks, [
    { label: 'Hugging Face', url: 'https://huggingface.co/Ugisr/warehouseflow-gemma3-1b-it-gguf' }
  ])
})

test('tools view features 5 Bento Box cards with complete architectural metadata', () => {
  assert.equal(toolGroups?.length, 5)
  assert.deepEqual(
    toolGroups?.map((group) => group.id),
    ['llm-agents', 'ai-infrastructure', 'product-engineering', 'github-profile', 'tech-arsenal']
  )
  for (const group of toolGroups) {
    assert.ok(group.id)
    assert.ok(group.title)
    assert.ok(group.badge)
    assert.ok(group.explanation)
    assert.ok(group.explanation.title)
    assert.ok(group.explanation.purpose)
    assert.ok(group.explanation.highlights?.length > 0)
  }
})

test('only public project records provide external actions', () => {
  for (const project of featuredProjects) {
    assert.equal(project.publicLinks.length > 0, project.visibility === 'public')
  }
})

test('portfolio positioning leads with applied AI engineering', () => {
  assert.equal(portfolioPositioning.primaryRole, 'Applied AI Engineer')
  assert.match(portfolioPositioning.summary, /domain-agent systems/i)
})

test('verified credentials do not use aggregate achievement claims', () => {
  const text = JSON.stringify(verifiedCredentials)
  assert.doesNotMatch(text, /Awards Won|5-Star Reviews|Google Developer Expert/i)
})
