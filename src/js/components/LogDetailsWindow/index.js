/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import {Md5Panel} from "../LogDetails/Md5Panel"
import ConnPanel from "../LogDetails/ConnPanel"
import Current from "../../state/Current"
import FieldsPanel from "../LogDetails/FieldsPanel"
import HistoryButtons from "../common/HistoryButtons"
import LogDetails from "../../state/LogDetails"
import NavAnimation from "../LogDetails/NavAnimation"
import PacketsButton from "../PacketsButton"
import UidPanel from "../LogDetails/UidPanel"
import menu from "../../electron/menu"

export default function LogDetailsWindow() {
  let dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).prevExists()
  const nextExists = useSelector(LogDetails.getHistory).nextExists()
  const log = useSelector(LogDetails.build)
  const space = useSelector(Current.getSpace)
  const isGoingBack = useSelector(LogDetails.getIsGoingBack)

  return (
    <NavAnimation log={log} prev={isGoingBack}>
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
        <div className="log-detail-container">
          <div className="log-detail-body-wrapper">
            <div className="log-detail-body">
              <FieldsPanel
                log={log}
                contextMenu={menu.detailFieldContextMenu}
              />
              {log.correlationId() && <UidPanel log={log} />}
              <ConnPanel log={log} contextMenu={menu.detailFieldContextMenu} />
              {log.getString("md5") && (
                <Md5Panel log={log} contextMenu={menu.detailFieldContextMenu} />
              )}
            </div>
          </div>
        </div>
      </div>
    </NavAnimation>
  )
}
