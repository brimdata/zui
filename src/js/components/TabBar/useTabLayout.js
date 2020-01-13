/* @flow */
import {useEffect, useState} from "react"

import {useResizeObserver} from "../hooks/useResizeObserver"
import lib from "../../lib"
import useDrag from "../hooks/useDrag"

const MAX_WIDTH = 240

export default function(count: number) {
  let {ref, rect} = useResizeObserver()
  let [width, setWidth] = useState(0)
  let [dx, setDx] = useState(0)
  let [dragId, setDragId] = useState(null)
  let [dragIndex, setDragIndex] = useState(-1)
  let [hoverIndex, setHoverIndex] = useState(dragIndex)

  useEffect(() => {
    calcWidth()
  }, [rect.width])

  function calcWidth() {
    setWidth(lib.bounded(rect.width / count, [0, MAX_WIDTH]))
  }

  function getDragLeft() {
    return dragIndex * width + dx
  }

  function getStyle(i: number, id: string) {
    if (dragId) {
      if (i >= hoverIndex && i < dragIndex) i++
      if (i > dragIndex && i <= hoverIndex) i--
    }

    let left = id === dragId ? getDragLeft() : i * width
    return {
      width: width,
      transform: `translateX(${lib.bounded(left, [0, rect.width])}px)`
    }
  }

  function getHoverIndex(startIndex, dx) {
    var half = width / 2
    var midX = startIndex * width + dx + half
    return parseInt(midX / width)
  }

  let drag = useDrag(({args, dx, type}) => {
    switch (type) {
      case "down":
        setDragIndex(args.index)
        setDragId(args.id)
        args.onDown()
        break
      case "move":
        setDx(dx)
        setHoverIndex(getHoverIndex(args.index, dx))
        break
      case "up":
        console.log("up", args.id)
        setDragId(null)
        var hoverIndex = getHoverIndex(args.index, dx)
        if (hoverIndex !== args.index) {
          args.moveTo(hoverIndex)
        }
        break
    }
  })

  return {
    width,
    ref,
    calcWidth,
    getStyle,
    dragId,
    drag
  }
}
