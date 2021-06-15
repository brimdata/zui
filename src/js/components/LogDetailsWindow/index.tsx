import {useDispatch, useSelector} from "react-redux"
import React from "react"
import useStoreExport from "../../../../app/core/hooks/useStoreExport"
import usePluginToolbarItems from "../../../../app/toolbar/hooks/usePluginToolbarItems"

import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import Current from "../../state/Current"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import DetailPane from "app/detail/Pane"
import ToolbarAction from "app/toolbar/action-button"
import brim from "src/js/brim"
import Prefs from "src/js/state/Prefs"
import View from "src/js/state/View"

export default function LogDetailsWindow() {
  useStoreExport()
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const pool = useSelector(Current.mustGetPool)
  const pluginButtons = usePluginToolbarItems("detail").map((button) => (
    <ToolbarAction key={button.label} {...button} />
  ))
  brim.time.setZone(useSelector(View.getTimeZone))
  brim.time.setDefaultFormat(useSelector(Prefs.getTimeFormat))

  return (
    <div className="log-detail-window">
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
        <Center>
          <PaneTitle>Log details for pool: {pool.name}</PaneTitle>
        </Center>
        <Right>
          <div>{pluginButtons}</div>
        </Right>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}
