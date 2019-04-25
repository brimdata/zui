/* @flow */
import type {Span} from "../BoomClient/types"
import type {Thunk} from "../state/types"
import {createError} from "../state/errors"

export function fetchSearch(program: string, span: Span, space: string): Thunk {
  return (dispatch, g, boom) =>
    boom
      .search(program, {searchSpan: span, searchSpace: space})
      .error(recordError(dispatch))
}

export function fetchSpaces(): Thunk {
  return (dispatch, g, boom) => boom.spaces.list().catch(recordError(dispatch))
}

export function fetchSpace(name: string): Thunk {
  return (dispatch, g, boom) =>
    boom.spaces.get(name).catch(recordError(dispatch))
}

export function fetchLookytalkVersions(): Thunk {
  return (dispatch, g, boom) =>
    boom
      .serverVersion()
      // $FlowFixMe
      .then(({lookytalk}) => ({
        server: lookytalk,
        client: boom.clientVersion().lookytalk
      }))
      .catch(recordError(dispatch))
}

export function boomFetchDescriptors(space: string, id: string): Thunk {
  return (dispatch, g, boom) =>
    boom.descriptors.get(space, id).catch(recordError(dispatch))
}

function recordError(dispatch) {
  return function(error) {
    dispatch(createError(error))
    throw error
  }
}
