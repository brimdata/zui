/* @flow */
import {useEffect, useState} from "react"

import {useResizeObserver} from "../hooks/useResizeObserver"
import lib from "../../lib"
import useDrag from "../hooks/useDrag"

const MAX_WIDTH = 240

export default function(count: number) {
  let {ref, rect} = useResizeObserver()
  let [width, setWidth] = useState(0)
  let [dragId, setDragId] = useState(null)
  let [dx, setDx] = useState(0)
  let [dragIndex, setDragIndex] = useState(-1)

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
    let left = id === dragId ? getDragLeft() : i * width
    return {
      width: width,
      transform: `translateX(${lib.bounded(left, [0, rect.width])}px)`
    }
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
        var half = width / 2
        var midX = args.index * width + dx + half
        var newIndex = parseInt(midX / width)
        args.moveTo(newIndex)
        break
      case "up":
        setDragId(null)
        setDx(0)
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
