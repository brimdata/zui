/* @flow */

import type {Column} from "../types"
import {type State} from "./types"
import createReducer from "./createReducer"

const initialState = {}

export type Descriptors = {[string]: Column[]}

export default createReducer(initialState, {
  DESCRIPTORS_CLEAR: () => ({...initialState}),
  DESCRIPTOR_RECEIVE: (state, {space, id, descriptor}) => ({
    ...state,
    [space + "." + id]: descriptor
  })
})

export const getDescriptors = (state: State) => {
  return state.descriptors
}
