export const generateRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export const generateRandomGuestName = () => {
  const names = ['Guest', 'Anonymous', 'Someone']
  return names[Math.round((Math.random() * 10) % (names.length - 1))] + '_' + String(Math.trunc(randomRange(10, 99)))
}

export const getRandomExpression = () => {
  const expressions = ['happy', 'lol']
  return expressions[Math.round((Math.random() * 10) % (expressions.length - 1))]
}

export const isTouchableScreen = () => 'ontouchstart' in document.documentElement

export const getHashValue = name => {
  const hashes = new Proxy(new URLSearchParams(window.location.hash.replace('#', '')), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  return decodeURIComponent(hashes[name] || '')
}

export const setHashValue = (name, value) => {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.hash.replace('#', ''))
  value.trim() === '' ? params.delete(name) : params.set(name, encodeURIComponent(value))

  url.hash = '#' + params.toString()
  window.location.href = url
}

export const setStoreValue = (key, value) => window.localStorage.setItem(key, value)

export const getStoreValue = key => window.localStorage.getItem(key)

export const randomRange = (min, max) => Math.random() * (max - min) + min
