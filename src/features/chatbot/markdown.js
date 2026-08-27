const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const isHttpUrl = (value) => /^https?:\/\//i.test(value)

const renderLink = (label, href) => `<a href="${href}" rel="noreferrer noopener" target="_blank">${label}</a>`

const renderInline = (text) => {
  const tokens = []
  const keep = (html) => {
    const marker = `@@CHAT_TOKEN_${tokens.length}@@`
    tokens.push(html)
    return marker
  }

  let rendered = escapeHtml(text)
    .replace(/`([^`\n]+)`/g, (_, code) => keep(`<code>${code}</code>`))
    .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, label, href) => (isHttpUrl(href) ? keep(renderLink(label, href)) : label))
    .replace(/(^|[\s(])(https?:\/\/[^\s<]+)/g, (_, prefix, rawHref) => {
      const trailing = rawHref.match(/[.,!?;:]+$/)?.[0] || ''
      const href = trailing ? rawHref.slice(0, -trailing.length) : rawHref
      return `${prefix}${keep(renderLink(href, href))}${trailing}`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')

  return rendered.replace(/@@CHAT_TOKEN_(\d+)@@/g, (_, index) => tokens[Number(index)])
}

export const formatChatMarkdown = (text) => {
  const blocks = []
  const paragraph = []
  const list = []
  let listType = ''

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push(`<p>${paragraph.map(renderInline).join('<br />')}</p>`)
    paragraph.length = 0
  }

  const flushList = () => {
    if (list.length > 0) blocks.push(`<${listType}>${list.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${listType}>`)
    list.length = 0
    listType = ''
  }

  String(text || '').replace(/\r/g, '').split('\n').forEach((line) => {
    const heading = line.match(/^#{1,3}\s+(.+?)\s*#*\s*$/)
    const unorderedItem = line.match(/^\s*[-*+]\s+(.+)$/)
    const orderedItem = line.match(/^\s*\d+[.)]\s+(.+)$/)

    if (heading) {
      flushParagraph()
      flushList()
      blocks.push(`<h4>${renderInline(heading[1])}</h4>`)
      return
    }

    if (unorderedItem || orderedItem) {
      flushParagraph()
      const nextListType = unorderedItem ? 'ul' : 'ol'
      if (listType && listType !== nextListType) flushList()
      listType = nextListType
      list.push((unorderedItem || orderedItem)[1])
      return
    }

    if (!line.trim()) {
      flushParagraph()
      flushList()
      return
    }

    flushList()
    paragraph.push(line)
  })

  flushParagraph()
  flushList()
  return blocks.join('')
}
