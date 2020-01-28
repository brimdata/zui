/* @flow */
import {useEffect, useState} from "react"

let pad = 8
export default function useTipPosition(
  anchor: ?HTMLElement,
  tip: ?HTMLElement
) {
  let [style, setStyle] = useState({})

  useEffect(() => {
    if (!anchor || !tip) return

    let {left, top} = anchor.getBoundingClientRect()
    let width = tip.clientWidth

    setStyle({
      transform: `translate3d(${left - width - pad}px, ${top}px, 0)`
    })
  }, [anchor, tip])

  return style
}
