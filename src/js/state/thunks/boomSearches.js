/* @flow */

import {type BoomSearchTag, getBoomSearches} from "../reducers/boomSearches"
import type {SearchTemplate} from "../../searches/types"
import type {Thunk} from "../reducers/types"
import {clearBoomSearches} from "../actions"
import {fetchSearch} from "../../backend/fetch"
import {getCurrentSpaceName} from "../reducers/spaces"
import {registerSearch} from "../searches/actions"
import baseHandler from "../../searches/handlers/baseHandler"

export const killBoomSearches = (tag?: BoomSearchTag): Thunk => (
  _dispatch,
  getState
) => {
  const state = getState()
  const searches = getBoomSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag)
      searches[name].handler.abortRequest()
  }
}

export const killBoomSearch = (name: string): Thunk => (_, getState) => {
  const searches = getBoomSearches(getState())
  searches[name] && searches[name].handler.abortRequest()
}

export const cancelBoomSearches = (tag?: BoomSearchTag): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const searches = getBoomSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag)
      searches[name].handler.abortRequest(false)
  }
  dispatch(clearBoomSearches(tag))
}

export const cancelBoomSearch = (name: string): Thunk => (
  dispatch,
  getState
) => {
  const searches = getBoomSearches(getState())
  if (searches[name]) {
    searches[name].handler.abortRequest(false)
  }
}

export const issueBoomSearch = (search: SearchTemplate): Thunk => (
  dispatch,
  getState
) => {
  dispatch(cancelBoomSearch(search.name))

  const {name, program, span, handlers = []} = search
  const space = getCurrentSpaceName(getState())
  const handler = dispatch(fetchSearch(program, span, space))

  handlers.push(baseHandler)
  handlers.forEach((buildCallbacks) => {
    let {each, abort, error} = buildCallbacks(dispatch, search)

    if (each) handler.each(each)
    if (error) handler.error(error)
    if (abort) handler.abort(abort)
  })

  dispatch(registerSearch(name, {handler, tag: search.tag}))
  return handler
}
