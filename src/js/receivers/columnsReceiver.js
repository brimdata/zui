import * as desc from "../reducers/descriptors"
import * as columns from "../actions/columns"
import * as actions from "../actions/descriptors"
import * as spaces from "../reducers/spaces"
import StateMachine from "../models/StateMachine"

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
