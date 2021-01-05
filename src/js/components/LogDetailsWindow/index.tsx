import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import Current from "../../state/Current"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import PacketsButton from "../Toolbar/PacketsButton"
import DetailPane from "app/detail/Pane"

export default function LogDetailsWindow() {
  const dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).prevExists()
  const nextExists = useSelector(LogDetails.getHistory).nextExists()
  const space = useSelector(Current.mustGetSpace)
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
          <PaneTitle>Log details for space: {space.name}</PaneTitle>
        </Center>
        <Right>
          <PacketsButton label={false} id="detail-window-packets" />
        </Right>
      </PaneHeader>
      <DetailPane />
    </div>
  )
}
