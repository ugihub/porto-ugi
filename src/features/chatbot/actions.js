export const parseActions = (text) => {
  const actionRegex = /\[ACTION:(\w+):(\w+)\]/g
  const actions = []
  let match
  while ((match = actionRegex.exec(text)) !== null) actions.push({ type: match[1], target: match[2] })
  return { cleanText: text.replace(/\[ACTION:\w+:\w+\]/g, '').trim(), actions }
}
