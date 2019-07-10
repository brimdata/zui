/* @flow */
import type {Dispatch, Thunk} from "../state/types"
import type {Span} from "../BoomClient/types"
import {createError} from "../state/errors"
import BoomRequest from "../BoomClient/lib/BoomRequest"

export function fetchSearch(program: string, span: Span, space: string): Thunk {
  return (dispatch, g, boom) =>
    boom
      .search(program, {searchSpan: span, searchSpace: space})
      .error(recordError(dispatch))
}

export function fetchSpaces(): Thunk {
  return (dispatch, g, boom) =>
    boom.spaces.list().error((error) => dispatch(createError(error)))
}

export function fetchSpace(name: string): Thunk {
  return (dispatch, g, boom) =>
    toPromise(boom.spaces.get(name)).catch(recordError(dispatch))
}

export function fetchLookytalkVersions(): Thunk {
  return (dispatch, g, boom) =>
    toPromise(boom.serverVersion())
      // $FlowFixMe
      .then(({lookytalk}) => ({
        server: lookytalk,
        client: boom.clientVersion().lookytalk
      }))
      .catch(recordError(dispatch))
}

export function boomFetchDescriptors(space: string, id: string): Thunk {
  return (dispatch, g, boom) =>
    toPromise(boom.descriptors.get(space, id)).catch(recordError(dispatch))
}

export function recordError(dispatch: Dispatch) {
  return function(error: Error) {
    dispatch(createError(error))
    throw error
  }
}

export function toPromise(request: BoomRequest) {
  // $FlowFixMe
  return new Promise((resolve, reject) => {
    request.done(resolve).error(reject)
  })
}
