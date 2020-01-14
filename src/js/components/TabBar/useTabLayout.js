/* @flow */
import {useEffect, useRef} from "react"
import {useSprings} from "react-spring"

import type {TabState} from "../../state/tab/types"
import lib from "../../lib"
import useDrag from "../hooks/useDrag"
import useFirst from "../hooks/useFirst"

const config = {
  tension: 500,
  friction: 50
}

function getHoverIndex(startIndex, width, dx) {
  var half = width / 2
  var midX = startIndex * width + dx + half
  return parseInt(midX / width)
}

const fn = (
  order,
  width,
  first,
  down,
  originalIndex,
  currentIndex = -1,
  dx
) => (index) => {
  if (down && originalIndex === index) {
    return {x: currentIndex * width + dx, immediate: true}
  } else {
    return {x: order.indexOf(index) * width, immediate: first, config}
  }
}

const toStyle = ({x, width}) => ({
  transform: x.interpolate((x) => `translateX(${x}px)`),
  width
})

export default function(tabs: TabState[], width: number) {
  let order = useRef(tabs.map((_, i) => i))
  let first = useFirst(width === 0)
  let [springs, set] = useSprings(tabs.length, fn(order.current, width, first))

  useEffect(() => {
    order.current = tabs.map((_, i) => i)
    set(fn(order.current, width, first))
  }, [tabs, width])

  let drag = useDrag(({args, dx, type}) => {
    if (type === "down") args.onDown()
    let currentIndex = order.current.indexOf(args.index)
    let hoverIndex = getHoverIndex(currentIndex, width, dx)
    let newOrder = lib.move(order.current, currentIndex, hoverIndex)
    set(
      fn(newOrder, width, false, type === "move", args.index, currentIndex, dx)
    )
    if (type === "up") order.current = newOrder
  })

  return {
    getStyle: (i: number) => toStyle({...springs[i], width}),
    drag
  }
}
