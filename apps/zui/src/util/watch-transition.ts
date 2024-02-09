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

  has(key, item) {
    if (this.map.has(key)) {
      return this.map.get(key).has(item)
    }
    return false
  }

  push(key, item) {
    if (this.map.has(key)) {
      this.map.get(key).add(item)
    } else {
      this.map.set(key, new Set([item]))
    }
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
  let allEnded = true
  const transitions = new SetStack()
  const signal = new Signal()

  function checkDone() {
    if (transitions.empty) {
      off()
      signal.resolve(allEnded)
    }
  }

  function onRun(e) {
    transitions.push(e.currentTarget, e.propertyName)
  }

  function onEnd(e) {
    if (transitions.has(e.currentTarget, e.propertyName)) {
      transitions.pop(e.currentTarget, e.propertyName)
      checkDone()
    }
  }

  function onCancel(e) {
    if (transitions.has(e.currentTarget, e.propertyName)) {
      allEnded = false
      transitions.pop(e.currentTarget, e.propertyName)
      checkDone()
    }
  }

  function off() {
    node.removeEventListener("transitionrun", onRun)
    node.removeEventListener("transitionend", onEnd)
    node.removeEventListener("transitioncancel", onCancel)
  }

  // add an expectation that a transition run will start in a few milliseconds,
  // otherwise throw an error indicating that the transition is maybe not working.

  node.addEventListener("transitionrun", onRun)
  node.addEventListener("transitionend", onEnd)
  node.addEventListener("transitioncancel", onCancel)

  return signal.promise
}
