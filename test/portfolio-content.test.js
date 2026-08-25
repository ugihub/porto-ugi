import assert from 'node:assert/strict'
import test from 'node:test'
import { featuredProjects, getProjectsForTab, portfolioPositioning, verifiedCredentials } from '../src/data/portfolioContent.js'

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
