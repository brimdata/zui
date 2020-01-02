/* @flow */

const {startCase, camelCase} = require("lodash")

const {write} = require("../utils/file")

export function handleReducer(name: string) {
  write(`src/js/state/${name}/index.js`, indexStub())
  write(`src/js/state/${name}/reducer.js`, reducerStub(name))
  write(`src/js/state/${name}/actions.js`, actionsStub())
  write(`src/js/state/${name}/selectors.js`, selectorsStub())
  write(`src/js/state/${name}/types.js`, typesStub(name))
  console.log(
    `Done: ${name}Reducer has been generated (You must add it to the rootReducer)`
  )
}

function classCase(name) {
  return startCase(camelCase(name))
}

function actionType(name) {
  return `${classCase(name)}Action`
}

function stateType(name) {
  return `${classCase(name)}State`
}

function indexStub() {
  return `/* @flow */

import actions from "./actions"
import reducer from "./reducer"
import selectors from "./selectors"

export default {
  ...actions,
  ...selectors,
  reducer
}`
}

function reducerStub(name) {
  return `/* @flow */

import type {${actionType(name)}, ${stateType(name)}} from "./types"

const init: ${stateType(name)} = {}

export default function reducer(
  state: ${stateType(name)} = init,
  action: ${actionType(name)}
): SpacesState {
  switch (action.type) {
    default:
      return state
  }
}
  `
}

function actionsStub() {
  return `/* @flow */

export default {}
`
}

function selectorsStub() {
  return `/* @flow */

export default {}
`
}

function typesStub(name) {
  return `/* @flow */

export type ${stateType(name)} = {}
export type ${actionType(name)} = {type: "STUB"}
`
}
