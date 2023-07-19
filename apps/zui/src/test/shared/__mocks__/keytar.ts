const map = new Map()

export default {
  getPassword: (key: string, username: string) => {
    return map.get(key + username)
  },
  setPassword: (key, username, password) => {
    map.set(key + username, password)
  },
  deletePassword: (key, username) => {
    map.delete(key + username)
  },
}
