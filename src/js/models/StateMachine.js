export default class StateMachine {
  constructor() {
    this.state = "START"
    this.transitions = {}
    this.init = () => {}
    this.states = {}
    this.persist = {}
  }

  whenStarting(cb) {
    this.when("START", cb)
  }

  when(state, cb) {
    if (typeof state === "string") {
      this.states[state] = cb
    } else {
      state.forEach(s => (this.states[s] = cb))
    }
  }

  goingTo(name, from, cb) {
    const trans = new Transition(name, from, cb)
    this.transitions[name] = trans
  }

  goTo(state, ...args) {
    const trans = this.fetchTransition(state)
    if (trans.isAllowedFrom(this.state)) {
      trans.cb(...args)
      this.state = state
    }
  }

  run(...args) {
    const cb = this.states[this.state]
    if (cb) cb(...args)
  }

  fetchTransition(state) {
    const trans = this.transitions[state]
    if (!trans) throw new Error(`Unknown transition to ${state}`)
    return trans
  }

  set(name, value) {
    this.persist[name] = value
  }

  get(name) {
    return this.persist[name]
  }
}

class Transition {
  constructor(name, from, cb) {
    this.name = name
    this.from = from
    this.cb = cb
  }

  isAllowedFrom(state) {
    if (this.from === "*") return true
    return typeof this.from === "string"
      ? state === this.from
      : this.from.includes(state)
  }
}
