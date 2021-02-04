import useResizeCallback from "app/core/hooks/useResizeCallback"
import Icon from "app/core/Icon"
import {MenuItemConstructorOptions} from "electron/main"
import React, {useCallback, useLayoutEffect, useRef, useState} from "react"
import useCallbackRef from "src/js/components/hooks/useCallbackRef"
import {showContextMenu} from "src/js/lib/System"
import styled from "styled-components"
import Action, {ToolbarActionProps} from "./action"
import Button from "./button"

const Wrap = styled.div`
  display: flex;
  flex: 1;
  margin: 0 8px;
`

const Actions = styled.div<{content: "center" | "flex-end"}>`
  display: flex;
  justify-content: ${(p) => p.content};
  flex: 1;
  & > * {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const Menu = styled(Button)`
  padding-right: 3px;
  min-width: 22px;
  flex-shrink: 0;
  margin-left: 4px;
  .icon i svg {
    width: 9px;
    height: 9px;
  }
`

function toMenu(actions: ToolbarActionProps[]): MenuItemConstructorOptions[] {
  return actions.map(({label, click, submenu, disabled}) => ({
    label,
    click,
    submenu,
    enabled: !disabled
  }))
}

export default function ResponsiveActions({actions}) {
  const [parent, setParent] = useCallbackRef()
  const widths = useRef([])
  const [splitIndex, setSplitIndex] = useState(100)

  useLayoutEffect(() => {
    if (!parent) return
    widths.current = Array.from(parent.children).map(
      (c) => c.getBoundingClientRect().width
    )
  }, [parent])

  const onResize = useCallback(
    ({width}) => {
      let total = 0
      let index = 0
      for (let childWidth of widths.current) {
        total += childWidth + 8
        if (total > width) break
        index++
      }
      if (index !== splitIndex) setSplitIndex(index)
    },
    [splitIndex]
  )

  const setResize = useResizeCallback(onResize)
  const visible = [...actions]
  const hidden = visible.splice(splitIndex)
  const setRef = (node) => {
    setResize(node)
    setParent(node)
  }
  const allVisible = hidden.length === 0
  return (
    <Wrap>
      <Actions ref={setRef} content={allVisible ? "center" : "flex-end"}>
        {visible.map((props, i) => (
          <Action key={i} {...props} />
        ))}
      </Actions>
      {!allVisible && (
        <Menu
          icon={<Icon name="double-chevron-right" />}
          onClick={() => showContextMenu(toMenu(hidden))}
        />
      )}
    </Wrap>
  )
}
