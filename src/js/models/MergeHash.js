export default class MergeHash {
  hash: Object

  constructor(hash: Object = {}) {
    this.hash = hash
  }

  get(key: string, defaultVal: * = {}) {
    return this.hash[key] || defaultVal
  }

  set(key: string, data: *) {
    this.hash[key] = data
  }

  merge(key: *, data: *) {
    const value = this.get(key)

    if (value) this.set(key, {...data, ...value})
    else this.set(key, {...value})
  }

  toJSON() {
    return this.hash
  }
}
