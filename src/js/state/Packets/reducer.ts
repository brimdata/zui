import {Download, PacketsAction, PacketsState} from "./types"

const init: PacketsState = []

export default function reducer(
  state: PacketsState = init,
  action: PacketsAction
): PacketsState {
  switch (action.type) {
    case "PACKETS_REQUEST":
      return [initDownload(action.uid), ...state]

    case "PACKETS_RECEIVE":
      return updateDownload(state, action.uid, {
        percentComplete: 1.0,
        error: null
      })

    case "PACKETS_ERROR":
      return updateDownload(state, action.uid, {error: action.error})

    default:
      return state
  }
}

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
