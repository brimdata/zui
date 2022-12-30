import classNames from "classnames"
import React, {useState} from "react"
import {BuiltMenu} from "src/core/menu"
import styled from "styled-components"
import useResizeObserver from "use-resize-observer"
import {IconButton} from "./icon-button"
import {MoreItemsButton} from "./more-items-button"

const BG = styled.menu`
  display: flex;
  position: relative;
  padding: 0;
  min-width: 0;

  .button-menu__button--hidden {
    visibility: hidden;
  }
`

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  overflow: hidden;
`

function useVisibleChildrenCount(ref, total) {
  const [visibleCount, setVisibleCount] = useState(total)
  useResizeObserver({
    ref,
    onResize: (size) => {
      const parent = ref.current
      if (!parent) return
      let visibleCount = 0
      for (const rightEdge of getRightEdges(parent)) {
        if (rightEdge <= size.width) visibleCount++
      }
      setVisibleCount(visibleCount)
    },
  })
  return visibleCount
}

function getRightEdges(parent: HTMLElement) {
  const parentBox = parent.getBoundingClientRect()
  const rightEdges = []
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i]
    const box = child.getBoundingClientRect()
    const left = box.left - parentBox.left
    const right = left + box.width
    rightEdges.push(right)
  }
  return rightEdges
}

export function useResponsiveMenu(ref, items) {
  const visibleCount = useVisibleChildrenCount(ref, items.length)
  const hiddenItems = items.slice(visibleCount, items.length)
  const hasHiddenItems = !!hiddenItems.length

  return {
    items,
    isHidden: (index: number) => index + 1 > visibleCount,
    hiddenItems,
    hasHiddenItems,
  }
}

export function ButtonMenu(props: {menu: BuiltMenu}) {
  const ref = React.useRef<HTMLDivElement>()
  const menu = useResponsiveMenu(ref, props.menu.items)

  const buttons = menu.items.map((item, i) => {
    return (
      <IconButton
        {...item}
        key={i}
        className={classNames({
          "button-menu__button--hidden": menu.isHidden(i),
        })}
      />
    )
  })

  return (
    <>
      <BG>
        <Buttons ref={ref}>{buttons}</Buttons>
        {menu.hasHiddenItems ? (
          <MoreItemsButton items={menu.hiddenItems} />
        ) : null}
      </BG>
    </>
  )
}
