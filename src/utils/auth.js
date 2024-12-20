const TOKEN_KEY = 'kyw_token'
const REMEMBER_KEY = 'kyw_remember'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function saveRememberInfo(username, password) {
  localStorage.setItem(REMEMBER_KEY, JSON.stringify({ username, password }))
}

export function getRememberInfo() {
  const info = localStorage.getItem(REMEMBER_KEY)
  return info ? JSON.parse(info) : null
}

export function clearRememberInfo() {
  localStorage.removeItem(REMEMBER_KEY)
} 