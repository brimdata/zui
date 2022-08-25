import React from "react"
import DetailPane from "src/app/detail/Pane"
import {useSelector} from "react-redux"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import ExpandWindow from "src/js/icons/ExpandWindow"
import LogDetails from "src/js/state/LogDetails"
import HistoryButtons from "src/js/components/common/HistoryButtons"
import {useDispatch} from "../../core/state"
import NoSelection from "../../detail/NoSelection"
import {Left, PaneBody, PaneHeader, Right} from "./common"
import {zed} from "@brimdata/zealot"

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
