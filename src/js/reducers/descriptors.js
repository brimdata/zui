/* @flow */

import createReducer from "./createReducer"
import {type State} from "./types"
const initialState = {}

type Descriptor = {type: string, name: string}
export type Descriptors = {[string]: Descriptor[]}

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
