/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "../LogDetails/Md5Panel"
import ConnPanel from "../LogDetails/ConnPanel"
import FieldsPanel from "../LogDetails/FieldsPanel"
import LogDetails from "../../state/LogDetails"
import UidPanel from "../LogDetails/UidPanel"
import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import Tab from "../../state/Tab"
import HistoryButtons from "../common/HistoryButtons"
import PacketsButton from "../PacketsButton"
import menu from "../../electron/menu"
import NavAnimation from "../LogDetails/NavAnimation"

export default function LogDetailsWindow() {
  let dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).prevExists()
  const nextExists = useSelector(LogDetails.getHistory).nextExists()
  const log = useSelector(LogDetails.build)
  const space = useSelector(Tab.space)
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
