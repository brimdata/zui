export class StorageSlice<T> {
  constructor(public key: string, public coerce: (string: string) => T) {}

  set(value: T) {
    localStorage.setItem(this.key, value.toString())
  }

  get() {
    return this.coerce(localStorage.getItem(this.key))
  }
}
