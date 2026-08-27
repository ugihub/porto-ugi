import assert from 'node:assert/strict'
import test from 'node:test'

let formatChatMarkdown

try {
  ({ formatChatMarkdown } = await import('../src/features/chatbot/markdown.js'))
} catch {
  formatChatMarkdown = undefined
}

test('renders supported chat markdown without visible syntax tokens', () => {
  assert.equal(typeof formatChatMarkdown, 'function')

  const result = formatChatMarkdown('## AI Laboratory\n\n**WarehouseFlow** memakai *tool calling* dan `GGUF`.\n\n- Tool-call console\n- RAG inspector')

  assert.match(result, /<h4>AI Laboratory<\/h4>/)
  assert.match(result, /<strong>WarehouseFlow<\/strong>/)
  assert.match(result, /<em>tool calling<\/em>/)
  assert.match(result, /<code>GGUF<\/code>/)
  assert.match(result, /<ul><li>Tool-call console<\/li><li>RAG inspector<\/li><\/ul>/)
  assert.doesNotMatch(result, /##|\*\*/)
})

test('links HTTP URLs and keeps unsafe LLM markup inert', () => {
  assert.equal(typeof formatChatMarkdown, 'function')

  const result = formatChatMarkdown('[WarehouseFlow](https://huggingface.co/Ugisr/warehouseflow-gemma3-1b-it-gguf)\n[Unsafe](javascript:alert(1))\n<script>alert(1)</script>\nVisit https://github.com/ugihub.')

  assert.match(result, /<a href="https:\/\/huggingface\.co\/Ugisr\/warehouseflow-gemma3-1b-it-gguf" rel="noreferrer noopener" target="_blank">WarehouseFlow<\/a>/)
  assert.doesNotMatch(result, /href="javascript:/)
  assert.match(result, /<a href="https:\/\/github\.com\/ugihub" rel="noreferrer noopener" target="_blank">https:\/\/github\.com\/ugihub<\/a>\./)
  assert.match(result, /Unsafe/)
  assert.match(result, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.doesNotMatch(result, /<script>/)
})
