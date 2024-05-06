import React from "react"
import DetailPane from "src/app/detail/Pane"
import {useSelector} from "react-redux"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import ExpandWindow from "src/js/icons/ExpandWindow"
import LogDetails from "src/js/state/LogDetails"
import {useDispatch} from "../../app/core/state"
import NoSelection from "../../app/detail/NoSelection"
import {Left, PaneBody, PaneHeader, Right} from "./common"
import * as zed from "@brimdata/zed-js"
import {HistoryButtons} from "../details-window/history-buttons"

const DetailSection = () => {
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).canGoBack()
  const nextExists = useSelector(LogDetails.getHistory).canGoForward()
  const currentLog = useSelector(LogDetails.build)

  if (!currentLog && !(currentLog instanceof zed.Record)) return <NoSelection />
  return (
    <>
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
        <Right>
          <ExpandWindow
            onClick={() => dispatch(openLogDetailsWindow(currentLog))}
            className="panel-button"
          />
        </Right>
      </PaneHeader>
      <PaneBody>
        <DetailPane />
      </PaneBody>
    </>
  )
}

export default DetailSection
