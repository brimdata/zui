/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {LeftPane} from "./LeftPane"
import {XRightPane} from "./RightPane"
import Handlers from "../state/Handlers"
import StatusBar from "./StatusBar"
import TabBar from "./TabBar/TabBar"
import TabContent from "./TabContent"
import Tabs from "../state/Tabs"
import useSearchShortcuts from "./useSearchShortcuts"

export default function SearchPage() {
  let dispatch = useDispatch()
  let tabId = useSelector(Tabs.getActive)

  useSearchShortcuts()
  useEffect(() => () => dispatch(Handlers.abortAll()), [])

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <TabBar />
          <TabContent key={tabId} />
          <StatusBar />
        </div>
        <XRightPane key={tabId} />
      </div>
    </div>
  )
}
