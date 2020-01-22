/* @flow */
import {useEffect, useRef} from "react"
import {useSprings} from "react-spring"

import type {TabState} from "../../state/Tab/types"
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

const interpolate = ({x, width}) => ({
  transform: x.interpolate((x) => `translateX(${x}px)`),
  width
})

function mapToSprings(ids) {
  // Springs never change order even thought the ids may change order.
  // Therefore to remember the spring, we must remember the initial order
  // the tabs were in before anyone rearranged them.
  // This map provides a record of which spring belongs to which id.
  let map = new Map()
  ids.forEach((id, i) => map.set(id, i))
  return map
}

// The are the update function for when not dragging
const idle = (springOrder: number[], width: number, first: boolean) => (
  springIndex: number
) => {
  if (springOrder.includes(springIndex)) {
    let visibleIndex = springOrder.indexOf(springIndex)
    return {x: visibleIndex * width, config, immediate: first, width}
  } else {
    // We don't know of this spring yet, the next time useEffects run, then the
    // spring will be registered.
    return {}
  }
}

// The update function for when use is dragging
const dragging = (
  springOrder: number[],
  dragSpringIndex: number,
  dragIndex: number,
  width: number,
  dx: number
) => (springIndex: number) => {
  if (dragSpringIndex === springIndex) {
    let x = dragIndex * width + dx
    return {x, width, immediate: true}
  } else {
    let x = springOrder.indexOf(springIndex) * width
    return {x, width, config, immediate: false}
  }
}

// Take the order the tabs are visibly in, then get the index of the springs
// that correspond to those tabs.
function orderSprings(
  orderedIds: string[],
  map: Map<string, number>
): number[] {
  // $FlowFixMe
  return orderedIds.map<number>((id) => map.get(id))
}

const getIds = (tabs) => tabs.map((t) => t.id)

export default function(tabs: TabState[], width: number) {
  let first = useFirst(width === 0) // The first renders are when the with === 0
  let ids = useRef(getIds(tabs))
  let map = useRef(mapToSprings(ids.current))
  let springOrder = orderSprings(ids.current, map.current)

  // This is a terrible api, but these springs only run this passed in update
  // function when the length changes. Since we are also re-ordering them, we
  // have to keep all this state about the original order and how it maps to
  // the new order.
  let [springs, set] = useSprings(
    ids.current.length,
    idle(springOrder, width, first)
  )
  let interuptDrag = useRef(false)

  useEffect(() => {
    // This effect is called when the tabs are reordered/added/removed
    // Keep track of the ids order so we can "move" the springs to the right
    // place.
    ids.current = getIds(tabs)
  })

  useEffect(() => {
    // This effect is only called when tabs are added/removed
    interuptDrag.current = true
    map.current = mapToSprings(ids.current)
    let springOrder = orderSprings(ids.current, map.current)
    set(idle(springOrder, width, first))
  }, [tabs.length, width, first])

  // The drag handler
  let dragBinding = useDrag(({args, dx, type}) => {
    if (type === "down") {
      // This fires once at the beginning of the drag
      interuptDrag.current = false
      args.onDown()
    }
    // If a tab is added or removed while dragging, stop this handler
    if (interuptDrag.current) return false

    // This updates the positions of the tabs when you are dragging
    // $FlowFixMe
    let dragSpringIndex: number = map.current.get(args.id)
    let dragIndex = ids.current.indexOf(args.id)
    let dragOverIndex = getHoverIndex(dragIndex, width, dx)
    let newOrder = lib.move(ids.current, dragIndex, dragOverIndex)
    let newSpringOrder = orderSprings(newOrder, map.current)
    set(dragging(newSpringOrder, dragSpringIndex, dragIndex, width, dx))

    if (type == "up") {
      // This fires once when the drag is over
      let indices = newOrder.map((id) => ids.current.indexOf(id))
      args.onChange(indices)
      set(idle(newSpringOrder, width, false))
    }
  })

  return {
    getStyle: (id: string) => {
      let spring = springs[map.current.get(id)]
      return spring ? interpolate(spring) : {}
    },
    dragBinding
  }
}
