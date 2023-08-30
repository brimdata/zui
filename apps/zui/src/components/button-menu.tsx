import classNames from "classnames"
import React, {useLayoutEffect, useState} from "react"
import {MenuItem} from "src/core/menu"
import styled from "styled-components"
import useResizeObserver from "use-resize-observer"
import {IconButton} from "./icon-button"
import {MoreItemsButton} from "./more-items-button"

const BG = styled.menu`
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 0;
  min-width: 0;
  width: 100%;

  .button-menu__button--hidden {
    visibility: hidden;
    display: none;
  }
`

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  overflow: hidden;
`

function useVisibleChildrenCount(ref, total) {
  const [measurements, setMeasurements] = useState([])
  const [visibleCount, setVisibleCount] = useState(total)

  // Cache the right edges when originally rendered
  useLayoutEffect(() => {
    const container = ref.current
    if (!parent) return
    const buttonParent = container.children[0]
    setMeasurements(getRightEdges(buttonParent))
  }, [total])

  useResizeObserver({
    ref,
    onResize: (size) => {
      const parent = ref.current
      if (!parent) return
      let visibleCount = 0
      for (const rightEdge of measurements) {
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
  const allVisible = visibleCount === items.length
  const sliceAt = allVisible ? items.length : visibleCount - 1
  const hiddenItems = items.slice(sliceAt, items.length)
  const hasHiddenItems = !!hiddenItems.length
  return {
    items,
    isHidden: (item) => hiddenItems.indexOf(item) != -1,
    hiddenItems,
    hasHiddenItems,
  }
}

export function ButtonMenu(props: {label: string; items: MenuItem[]}) {
  const ref = React.useRef<HTMLDivElement>()
  const menu = useResponsiveMenu(ref, props.items)

  const buttons = menu.items.map((item: MenuItem, i: number) => {
    return (
      <IconButton
        {...item}
        key={i}
        className={classNames({
          "button-menu__button--hidden": menu.isHidden(item),
        })}
      />
    )
  })

  return (
    <>
      <BG aria-label={props.label} ref={ref}>
        <Buttons>
          {buttons}
          {menu.hasHiddenItems ? (
            <MoreItemsButton items={menu.hiddenItems} />
          ) : null}
        </Buttons>
      </BG>
    </>
  )
}
