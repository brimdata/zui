/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpaces} from "./fetch"

export function testConnection(): Thunk {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(fetchSpaces())
        .done(() => resolve())
        .error((e) => reject(e))
    })
  }
}
