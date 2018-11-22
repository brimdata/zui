import * as desc from "../reducers/descriptors"
import * as columns from "../actions/columns"
import * as actions from "../actions/descriptors"
import * as spaces from "../reducers/spaces"

export default (dispatch, state) => {
  const machine = createStateMachine(dispatch, state)

  return ({type, results}) => {
    if (type === "SearchResult") {
      machine.run(results.tuples)
    }
  }
}

const createStateMachine = (dispatch, state) => {
  const machine = new StateMachine()

  machine.whenStarting(tuples => {
    if (sameTds(tuples)) {
      const td = tuples[0][0]
      machine.set("td", td)
      const desc = lookup(td, state)
      if (desc) {
        machine.goTo("SAME", desc)
      } else {
        machine.goTo("FETCHING", td)
      }
    } else {
      machine.goTo("MIXED")
    }
  })

  machine.when(["SAME", "FETCHING"], tuples => {
    if (machine.get("td") !== sameTds(tuples)) {
      machine.goTo("MIXED")
    }
  })

  machine.goingTo("MIXED", "*", () => {
    dispatch(columns.setColumns([]))
  })

  machine.goingTo("SAME", ["START", "FETCHING"], desc => {
    dispatch(columns.setColumns(desc))
  })

  machine.goingTo("FETCHING", ["START"], td => {
    dispatch(actions.fetchDescriptor(td)).done(descriptor => {
      machine.goTo("SAME", descriptor)
    })
  })

  return machine
}

const sameTds = tuples => {
  if (tuples.length === 0) return false

  const [firstTd] = tuples[0]

  for (let i = 1; i < tuples.length; i++) {
    if (firstTd !== tuples[i][0]) return false
  }

  return firstTd
}

const lookup = (td, state) => {
  const descriptors = desc.getDescriptors(state)
  const space = spaces.getCurrentSpaceName(state)
  return descriptors[space + "." + td]
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

class StateMachine {
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
