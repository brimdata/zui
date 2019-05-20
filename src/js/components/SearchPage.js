/* @flow */

import {Redirect} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {LeftPane} from "./LeftPane"
import {NetworkError, UnauthorizedError} from "../models/Errors"
import {XControlBar} from "./ControlBar"
import {XDownloadProgress} from "./DownloadProgress"
import {XHistogram} from "./Histogram"
import {XRightPane} from "./RightPane"
import {XSearchInspector} from "./SearchInspector"
import {XSearchResults} from "./SearchResults/SearchResults"
import {XSettingsModal} from "./SettingsModal"
import {XStatusBar} from "./StatusBar"
import {XTitleBar} from "./TitleBar"
import {XWhoisModal} from "./WhoisModal"
import {getCurrentFinding} from "../state/reducers/investigation"
import {getShowLogsTab} from "../state/reducers/view"
import {initSearchPage} from "../state/thunks/searchPage"
import {setAppMenu} from "../electron/setAppMenu"
import {useResizeObserver} from "../hooks/useResizeObserver"
import AppError from "../models/AppError"
import ColumnChooser from "./ColumnChooser"
import ErrorFactory from "../models/ErrorFactory"
import StartupError from "./StartupError"

export default function SearchPage() {
  let dispatch = useDispatch()
  let [ready, setReady] = useState<boolean>(false)
  let [error, setError] = useState<AppError | null>(null)
  let logsTab = useSelector(getShowLogsTab)
  let finding = useSelector(getCurrentFinding)
  let renderKey = finding && finding.ts.getTime().toString()
  let histogram = useResizeObserver()
  let results = useResizeObserver()

  useEffect(() => {
    setAppMenu("SEARCH")
    dispatch(initSearchPage())
      .then(() => setReady(true))
      .catch((e) => setError(ErrorFactory.create(e)))
  }, [])

  if (error instanceof UnauthorizedError || error instanceof NetworkError)
    return <Redirect to="/connect " />
  if (error) return <StartupError error={error} />
  if (!ready) return null

  return (
    <div className="search-page-wrapper">
      <div className="search-page">
        <LeftPane />
        <div className="search-page-main">
          <XTitleBar />
          <div className="search-page-header">
            <XControlBar />
            {logsTab && (
              <div className="search-page-header-charts" ref={histogram.ref}>
                <XHistogram
                  height={80}
                  width={histogram.rect.width}
                  key={renderKey}
                />
              </div>
            )}
            <ColumnChooser />
          </div>
          <div className="search-results" ref={results.ref}>
            <XSearchResults
              width={results.rect.width}
              height={results.rect.height}
            />
          </div>
          <XStatusBar />
        </div>
        <XRightPane />
      </div>
      <XSearchInspector />
      <XDownloadProgress />
      <XWhoisModal />
      <XSettingsModal />
    </div>
  )
}
