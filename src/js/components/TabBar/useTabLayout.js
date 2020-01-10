/* @flow */
import {useEffect, useState} from "react"

import {useResizeObserver} from "../hooks/useResizeObserver"

const MAX_WIDTH = 240

export default function(count: number) {
  let {ref, rect} = useResizeObserver()
  let [width, setWidth] = useState(0)

  useEffect(() => {
    calcWidth()
  }, [rect.width])

  const calcWidth = () => setWidth(Math.min(rect.width / count, MAX_WIDTH))
  const getLeft = (i: number) => i * width
  const getStyle = (i: number) => ({
    width: width,
    transform: `translateX(${getLeft(i)}px)`
  })

  return {
    ref,
    calcWidth,
    getStyle,
    getLeft
  }
}
