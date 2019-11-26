/* @flow */
import type {Cluster} from "../state/clusters/types"
import type {Span} from "../BoomClient/types"
import type {Thunk} from "../state/types"
import {ZqVersionError} from "../models/Errors"
import {createError} from "../state/errors"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import ErrorFactory from "../models/ErrorFactory"
import brim from "../brim"
import notice from "../state/notice"
import search from "../state/search"

export function fetchSearch(program: string, span: Span, space: string): Thunk {
  return (dispatch, g, boom) => {
    dispatch(notice.clear())
    return boom
      .search(program, {searchSpan: span, searchSpace: space})
      .error((e) => handleError(e, dispatch))
  }
}

export function fetchSpaces() {
  return promise((boom) => boom.spaces.list())
}

export function fetchSpace(name: string) {
  return promise((boom) => boom.spaces.get(name))
}

export function createSpace(name: string): Thunk {
  return promise((boom) => boom.spaces.create({name}))
}

export function testConnection(cluster: Cluster): Thunk {
  return function(dispatch, _, boom) {
    boom.setOptions({
      host: cluster.host,
      port: parseInt(cluster.port),
      username: cluster.username,
      password: cluster.password
    })
    return dispatch(fetchSpaces())
  }
}

export function checkVersions(): Thunk {
  return function(dispatch, _, boom) {
    let cv = boom.clientVersion()
    boom.serverVersion().done((sv) => {
      if (cv.zq !== sv.zq) {
        dispatch(notice.set(new ZqVersionError({client: cv.zq, server: sv.zq})))
      }
    })
  }
}

export function inspectSearch(zql: string): Thunk {
  return function(_, getState, boom) {
    let [from, to] = search.getSpan(getState())
    let searchSpan = [brim.time(from).toDate(), brim.time(to).toDate()]
    let searchSpace = getCurrentSpaceName(getState())
    try {
      return boom.inspectSearch(zql, {searchSpan, searchSpace})
    } catch {
      return null
    }
  }
}

function promise(request): Thunk {
  return function(dispatch, _, boom) {
    return new Promise((resolve, reject) => {
      request(boom)
        .done((...args) => {
          dispatch(notice.clear())
          resolve(...args)
        })
        .error((e) => {
          handleError(e, dispatch)
          reject(e)
        })
    })
  }
}

function handleError(e, dispatch) {
  dispatch(notice.set(ErrorFactory.create(e)))
  dispatch(createError(e))
}
