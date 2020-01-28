/* @flow */
import {useEffect, useState} from "react"

let pad = 8
export default function usePopper(anchor, popper, placement) {
  let [style, setStyle] = useState({})

  useEffect(() => {
    if (!anchor || !popper) return

    let {x, y} = anchor.getBoundingClientRect()
    let width = popper.clientWidth

    setStyle({
      transform: `translate3d(${x - width - pad}px, ${y}px, 0)`
    })
  }, [anchor, popper, placement])

  return style
}
