/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"

export default function SpaceDeletedNotice() {
  let dispatch = useDispatch()
  let space = useSelector(Tab.space)
  let name = useSelector(Tab.spaceName)
  let deleted = name && !space
  if (!deleted) return null

  const resetSpace = () => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(Search.setSpace(""))
  }

  return (
    <p className="notice-banner space-deleted">
      The space <b>{name}</b> has been deleted.
      <a onClick={resetSpace}>Ok</a>
    </p>
  )
}
