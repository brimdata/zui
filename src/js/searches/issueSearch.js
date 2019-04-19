/* @flow */
import type {SearchTemplate} from "./types"
import type {Thunk} from "../state/reducers/types"
import {clearSearchResults, registerSearch} from "../state/searches/actions"
import {fetchSearch} from "../backend/fetch"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {getSearches} from "../state/searches/selector"
import baseHandler from "./baseHandler"

export const issueSearch = (search: SearchTemplate): Thunk => (
  dispatch,
  getState
) => {
  let state = getState()
  let searches = getSearches(state)
  let space = getCurrentSpaceName(state)
  let {name, program, span, handlers = []} = search

  if (searches[name]) {
    searches[name].handler.abortRequest(false)
    dispatch(clearSearchResults(name))
  }

  const handler = dispatch(fetchSearch(program, span, space))

  handlers.push(baseHandler)
  handlers.forEach((buildCallbacks) => {
    let {each, abort, error} = buildCallbacks(dispatch, search)

    if (each) handler.each(each)
    if (abort) handler.abort(abort)
    if (error) handler.error(error)
  })

  dispatch(registerSearch(name, {handler, tag: search.tag}))
  return handler
}
