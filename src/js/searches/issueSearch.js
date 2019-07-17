/* @flow */
import type {SearchTemplate} from "./types"
import type {Thunk} from "../state/types"
import {clearSearchResults, registerSearch} from "../state/searches/actions"
import {fetchSearch} from "../backend/thunks"
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
    searches[name].handler.abort(false)
    dispatch(clearSearchResults(name))
  }

  const handler = dispatch(fetchSearch(program, span, space))

  handlers.push(baseHandler)
  handlers.forEach((buildCallbacks) => {
    let {each, abort, error} = buildCallbacks(dispatch, search)

    if (each) handler.stream(each)
    if (error) handler.error(error)
    if (abort) handler.onAbort(abort)
  })

  dispatch(registerSearch(name, {handler, tag: search.tag}))
  return handler
}
