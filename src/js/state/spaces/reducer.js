/* @flow */

import type {SpacesAction, SpacesState} from "./types"

const init: SpacesState = {}

export default function reducer(
  state: SpacesState = init,
  action: SpacesAction
): SpacesState {
  switch (action.type) {
    default:
      return state
  }
}
  