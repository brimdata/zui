/* @flow */
import type {Thunk} from "../state/types"
import {recordError, toPromise} from "./fetch"

export function createSpace(name: string): Thunk {
  return (dispatch, g, boom) =>
    toPromise(boom.spaces.create({name})).catch(recordError(dispatch))
}
