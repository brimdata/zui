/* @flow */

import createReducer from "./createReducer"

type Download = {
  uid: string,
  percentComplete: number,
  error: null | string
}

export const initialState: Download[] = []

export default createReducer(initialState, {
  PACKETS_REQUEST: (state, {uid}) => [initDownload(uid), ...state],
  PACKETS_RECEIVE: (state, {uid}) =>
    updateDownload(state, uid, {percentComplete: 1.0, error: null}),
  PACKETS_ERROR: (state, {uid, error}) => updateDownload(state, uid, {error})
})

const initDownload = (uid): Download => ({
  uid,
  percentComplete: 0.0,
  error: null
})

const updateDownload = (
  state: Download[],
  uid: string,
  newProps: Object
): Download[] => {
  const newState = [...state]
  const index = newState.findIndex((item: Download) => item.uid === uid)
  const item = newState[index]

  if (item) {
    newState[index] = {...item, ...newProps}
    return newState
  } else {
    return state
  }
}

export const getDownloads = (state: Object) => state.packets
