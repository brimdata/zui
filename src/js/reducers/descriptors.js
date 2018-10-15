/* @flow */

import createReducer from "./createReducer"

const initialState = {}

type Slice = {
  [string]: string[]
}
type State = {descriptors: Slice}

export default createReducer(initialState, {
  DESCRIPTOR_RECEIVE: (state, {space, id, descriptor}) => ({
    ...state,
    [space + "." + id]: descriptor
  })
})

export const getDescriptors = (state: State) => state.descriptors
