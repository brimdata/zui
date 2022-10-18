import React, {useLayoutEffect, useState} from "react"
import ActionButtons from "./action-buttons"
import ActionMenu from "./action-menu"
import {FillFlexParent} from "src/components/fill-flex-parent"
import MeasureLayer from "src/app/core/MeasureLayer"
import {GUTTER} from "../actions/action-buttons"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {ActionButtonProps} from "./action-button"

type Props = {
  width: number
  childWidths: number[]
  actions: ActionButtonProps[]
  estimatedChildWidth: number
}

function getSpliceIndex(props: Props) {
  const childWidths =
    props.childWidths ||
    new Array(props.actions.length).fill(props.estimatedChildWidth)

  let offset = 0
  let index = 0
  for (let childWidth of childWidths) {
    offset += childWidth + GUTTER
    if (offset > props.width) break
    index++
  }
  return index
}

const Actions = ({actions}: {actions: ActionButtonProps[]}) => {
  const [hiddenEl, setHiddenEl] = useCallbackRef()
  const [childWidths, setChildWidths] = useState<null | number[]>(null)

  useLayoutEffect(() => {
    if (!hiddenEl) return
    setChildWidths(Array.from(hiddenEl.children).map((c) => c.clientWidth))
  }, [hiddenEl])

  return (
    <>
      <MeasureLayer>
        <ActionButtons actions={actions} innerRef={setHiddenEl} />
      </MeasureLayer>
      <FillFlexParent>
        {({width}) => (
          <ResponsiveActions
            actions={actions}
            childWidths={childWidths}
            width={width}
            estimatedChildWidth={42}
          />
        )}
      </FillFlexParent>
    </>
  )
}

function ResponsiveActions(props: Props) {
  const index = getSpliceIndex(props)
  const visible = [...props.actions]
  const hidden = visible.splice(index)
  return (
    <>
      <ActionButtons actions={visible} />
      <ActionMenu actions={hidden} />
    </>
  )
}

export default Actions
