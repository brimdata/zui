import MeasureLayer from "src/app/core/MeasureLayer"
import React from "react"
import ActionButtons from "./action-buttons"
import ActionMenu from "./action-menu"
import useVisibleActions from "./hooks/useVisibleActions"
import {ActionButtonProps} from "./action-button"

/**
 * We must measure how big this component will be if all the actions are visible
 * to set correct flex basis. This is the "fullWidth" var you see below.
 */
export default function Actions({actions}: {actions: ActionButtonProps[]}) {
  const {visible, hidden, fullWidth, setMeasure, setParent} =
    useVisibleActions(actions)

  return (
    <>
      <MeasureLayer>
        <ActionButtons actions={actions} innerRef={setMeasure} />
      </MeasureLayer>
      <ActionButtons actions={visible} innerRef={setParent} width={fullWidth} />
      <ActionMenu actions={hidden} />
    </>
  )
}
