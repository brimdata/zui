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

const toStyle = ({x, width}) => ({
  transform: x.interpolate((x) => `translateX(${x}px)`),
  width
})

function mapIds(tabs) {
  let map = new Map()
  tabs.forEach((t, i) => map.set(t.id, i))
  return map
}

const idle = (springOrder: number[], width: number, first: boolean) => (
  springIndex: number
) => {
  return {x: springOrder.indexOf(springIndex) * width, config, immediate: first}
}

const dragging = (
  springOrder: number[],
  dragSpringIndex: number,
  dragIndex: number,
  width: number,
  dx: number
) => (springIndex: number) => {
  if (dragSpringIndex === springIndex) {
    return {x: dragIndex * width + dx, immediate: true}
  } else {
    return {x: springOrder.indexOf(springIndex) * width, immediate: false}
  }
}

function mapSpringOrder(
  ids: string[],
  order: number[],
  map: Map<string, number>
): number[] {
  // $FlowFixMe
  return order.map<number>((i) => map.get(ids[i]))
}

export default function(tabs: TabState[], width: number) {
  let map = useRef(mapIds(tabs))
  let first = useFirst(width === 0)
  let order = tabs.map((_, i) => i)
  let ids = tabs.map((t) => t.id)
  // console.log(ids, order, map.current)
  let springOrder = mapSpringOrder(ids, order, map.current)
  let [springs, set] = useSprings(tabs.length, idle(springOrder, width, first))

  useEffect(() => {
    map.current = mapIds(tabs)
  }, [tabs.length])

  useEffect(() => {
    set(idle(springOrder, width, first))
  }, [tabs.length, width])

  let drag = useDrag(({args, dx, type}) => {
    if (type === "down") {
      args.onDown()
    }
    // $FlowFixMe
    let dragSpringIndex: number = map.current.get(args.id)
    let dragIndex = ids.indexOf(args.id)
    let dragOverIndex = getHoverIndex(dragIndex, width, dx)
    let newOrder = lib.move(order, dragIndex, dragOverIndex)
    let newSpringOrder = mapSpringOrder(ids, newOrder, map.current)

    set(dragging(newSpringOrder, dragSpringIndex, dragIndex, width, dx))

    if (type == "up") {
      args.onChange(newOrder)
      set(idle(newSpringOrder, width, false))
    }
  })

  return {
    getStyle: (id: string) => toStyle({...springs[map.current.get(id)], width}),
    drag
  }
}
