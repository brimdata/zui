/* @flow */
import type {BoomPayload} from "../BoomClient/types"
import type {Dispatch} from "../state/types"
import type {SearchCallbackMap} from "./types"
import {updateFinding} from "../state/actions"

export default function(dispatch: Dispatch): SearchCallbackMap {
  let resultCount = 0

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchTuples":
        resultCount += payload.tuples.length
        break
    }

    dispatch(updateFinding({resultCount}))
  }

  return {each}
}
