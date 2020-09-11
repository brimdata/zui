const {camelCase, upperFirst} = require("lodash")

const {write} = require("../utils/file")

export function handleReducer(input) {
  let name = upperFirst(camelCase(input))
  write(`src/js/state/${name}/index.ts`, indexStub())
  write(`src/js/state/${name}/reducer.ts`, reducerStub(name))
  write(`src/js/state/${name}/actions.ts`, actionsStub())
  write(`src/js/state/${name}/selectors.ts`, selectorsStub())
  write(`src/js/state/${name}/types.ts`, typesStub(name))
  console.log(
    `Done: ${name}Reducer has been generated (You must add it to the rootReducer)`
  )
}

function actionType(name) {
  return `${name}Action`
}

function stateType(name) {
  return `${name}State`
}

function indexStub() {
  return `
import actions from "./actions"
import reducer from "./reducer"
import selectors from "./selectors"

export default {
  ...actions,
  ...selectors,
  reducer
}
`
}

function reducerStub(name) {
  return `
import type {${actionType(name)}, ${stateType(name)}} from "./types"

const init: ${stateType(name)} = {}

export default function reducer(
  state: ${stateType(name)} = init,
  action: ${actionType(name)}
): ${stateType(name)} {
  switch (action.type) {
    default:
      return state
  }
}
`
}

function actionsStub() {
  return `
export default {}
`
}

function selectorsStub() {
  return `

export default {}
`
}

function typesStub(name) {
  return `
export type ${stateType(name)} = {}
export type ${actionType(name)} = {type: "STUB"}
`
}
