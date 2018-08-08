export default class MergeHash {
  constructor(hash = {}) {
    this.hash = hash
  }

  get(key, defaultVal = {}) {
    return this.hash[key] || defaultVal
  }

  set(key, data) {
    this.hash[key] = data
  }

  merge(key, data) {
    const value = this.get(key)

    if (value) this.set(key, {...data, ...value})
    else this.set(key, {...value})
  }

  toJSON() {
    return this.hash
  }
}
