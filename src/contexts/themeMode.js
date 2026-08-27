const expandHex = (value) => value.length === 3 ? value.split('').map((digit) => digit + digit).join('') : value

export const getThemeMode = (background) => {
  const hex = expandHex(String(background || '').trim().replace(/^#/, ''))
  if (!/^[\da-f]{6}$/i.test(hex)) return 'dark'

  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const luminance = channels.map((channel) => (channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4))
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0)

  return luminance > .5 ? 'light' : 'dark'
}
