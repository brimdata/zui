/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {PaneTitle} from "./Pane"
import {getSearchInspectorIsOpen} from "../state/reducers/view"
import {hideSearchInspector} from "../state/actions"
import CloseButton from "./CloseButton"

export default function SearchInspector() {
  let isOpen = useSelector(getSearchInspectorIsOpen)
  let dispatch = useDispatch()

  if (!isOpen) return null

  return (
    <div className="search-inspector">
      <header>
        <PaneTitle>Search Inspector</PaneTitle>
        <CloseButton light onClick={() => dispatch(hideSearchInspector())} />
      </header>
      <section>
        <p className="empty">No searches to inspect.</p>
      </section>
    </div>
  )
}
