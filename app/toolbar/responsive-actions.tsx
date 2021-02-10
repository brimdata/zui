import useResizeEffect from "app/core/hooks/useResizeEffect"
import Icon from "app/core/Icon"
import MeasureLayer from "app/core/MeasureLayer"
import React, {RefCallback, useLayoutEffect, useState} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {showContextMenu} from "src/js/lib/System"
import styled from "styled-components"
import {toMenu, ActionButtonProps} from "./action-button"
import ActionButtons, {GUTTER} from "./action-buttons"
import Button from "./button"

const Wrap = styled.div`
  display: flex;
  flex: 1;
  margin: 0 ${GUTTER}px;
`

const Menu = styled(Button)`
  padding-right: 3px;
  min-width: 22px;
  flex-shrink: 0;
  margin-left: ${GUTTER / 2}px;
  .icon i svg {
    width: 9px;
    height: 9px;
  }
`

function useWidthsCache(deps: any[]): [RefCallback<HTMLDivElement>, number[]] {
  const [parent, setParent] = useCallbackRef<HTMLDivElement>()
  const [widths, setWidths] = useState([])
  useLayoutEffect(() => {
    if (parent) {
      setWidths(Array.from(parent.children).map((c) => c.clientWidth))
    }
  }, [parent, ...deps])
  return [setParent, widths]
}

function useSplitIndex(
  widths: number[]
): [RefCallback<HTMLDivElement>, number] {
  const [splitIndex, setSplitIndex] = useState(9999)
  const [node, setNode] = useCallbackRef<HTMLDivElement>()
  useResizeEffect(
    node,
    ({width}) => {
      let total = 0
      let index = 0
      for (let childWidth of widths) {
        total += childWidth + GUTTER
        if (total > width) break
        index++
      }
      if (index !== splitIndex) setSplitIndex(index)
    },
    [widths, splitIndex]
  )
  return [setNode, splitIndex]
}

type Props = {
  actions: ActionButtonProps[]
  mainView: string
}

export default function ResponsiveActions({actions, mainView}: Props) {
  const [setParent, widths] = useWidthsCache([actions.length, mainView])
  const [setResize, splitIndex] = useSplitIndex(widths)
  const visible = [...actions]
  const hidden = visible.splice(splitIndex)
  const allVisible = hidden.length === 0
  const justify = allVisible ? "center" : "flex-end"
  return (
    <Wrap>
      <MeasureLayer>
        {/* Render all the actions to measure their widths */}
        <ActionButtons
          actions={actions}
          innerRef={setParent}
          justify={justify}
        />
      </MeasureLayer>
      {/* Only visibly render the ones that fit */}
      <ActionButtons actions={visible} innerRef={setResize} justify={justify} />
      {/* Show the rest in a context menu */}
      {!allVisible && (
        <Menu
          icon={<Icon name="double-chevron-right" />}
          onClick={() => showContextMenu(toMenu(hidden))}
        />
      )}
    </Wrap>
  )
}
