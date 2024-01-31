class Signal {
  resolve: (value?: any) => any
  reject: () => any
  promise: Promise<any>

  constructor() {
    this.promise = new Promise((res, rej) => {
      this.resolve = res
      this.reject = rej
    })
  }
}

class SetStack {
  map = new Map<any, Set<any>>()
  pristine = true

  push(key, item) {
    if (this.map.has(key)) {
      this.map.get(key).add(item)
    } else {
      this.map.set(key, new Set([item]))
    }
    this.pristine = false
  }

  pop(key, item) {
    const set = this.map.get(key)
    if (!set) return
    set.delete(item)
    if (set.size === 0) this.map.delete(key)
  }

  get empty() {
    return this.map.size === 0
  }
}

export function transitionsComplete(node) {
  const transitions = new SetStack()
  const signal = new Signal()

  function add(e) {
    transitions.push(e.target, e.propertyName)
  }

  function remove(e) {
    transitions.pop(e.target, e.propertyName)
    if (transitions.empty && !transitions.pristine) {
      signal.resolve()
    }
  }

  function off() {
    node.removeEventListener("transitionrun", add)
    node.removeEventListener("transitionend", remove)
    node.removeEventListener("transitioncancel", remove)
  }

  node.addEventListener("transitionrun", add)
  node.addEventListener("transitionend", remove)
  node.addEventListener("transitioncancel", remove)

  return signal.promise.finally(off)
}
