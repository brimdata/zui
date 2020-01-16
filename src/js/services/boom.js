/* @flow */

import type {Cluster} from "../state/Clusters/types"
import type {Span} from "./BoomClient/types"
import type {Thunk} from "../state/types"
import {ZqVersionError} from "../models/Errors"
import {getBoomOptions} from "../state/selectors/boom"
import ErrorFactory from "../models/ErrorFactory"
import Errors from "../state/Errors"
import Notice from "../state/Notice"
import Tab from "../state/Tab"
import brim from "../brim"
import electronIsDev from "../electron/isDev"

export function fetchSearch(program: string, span: Span, space: string): Thunk {
  return (dispatch, getState, boom) => {
    dispatch(Notice.clearSearchError())
    return boom
      .setOptions(getBoomOptions(getState()))
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
  function extractVersion(string) {
    let match = string.match(/v\d+\.\d+\.\d+/)
    return match ? match[0] : string
  }

  return function(dispatch, _, boom) {
    let client = extractVersion(boom.clientVersion().zq)
    boom.serverVersion().done((resp) => {
      let server = extractVersion(resp.lookytalk || resp.zq)
      if (client !== server) {
        let error = new ZqVersionError({client, server})
        if (electronIsDev) {
          console.error(error.message(), error.details().join(", "))
        } else {
          dispatch(Notice.set(error))
        }
      }
    })
  }
}

export function inspectSearch(zql: string): Thunk {
  return function(_, getState, boom) {
    let [from, to] = Tab.getSpan(getState())
    let searchSpan = [brim.time(from).toDate(), brim.time(to).toDate()]
    let searchSpace = Tab.spaceName(getState())
    boom.setOptions(getBoomOptions(getState()))
    try {
      return boom.inspectSearch(zql, {searchSpan, searchSpace})
    } catch {
      return null
    }
  }
}

function promise(requestFunc): Thunk {
  return function(dispatch, getState, boom) {
    boom.setOptions(getBoomOptions(getState()))
    return new Promise((resolve, reject) => {
      requestFunc(boom)
        .done((...args) => {
          dispatch(Notice.clearNetworkError())
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
  dispatch(Notice.set(ErrorFactory.create(e)))
  dispatch(Errors.createError(e))
}
