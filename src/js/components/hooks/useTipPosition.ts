import {useEffect, useState} from "react"

const pad = 8
export default function useTipPosition(
  anchor: HTMLElement | null | undefined,
  tip: HTMLElement | null | undefined
) {
  const [style, setStyle] = useState({})

  useEffect(() => {
    if (!anchor || !tip) return

    let {left, top} = anchor.getBoundingClientRect()
    const width = tip.clientWidth
    const height = tip.clientHeight

    if (top + height > window.innerHeight) {
      // Clamp to the bottom
      const diff = top + height - window.innerHeight
      top -= diff
    }

    setStyle({
      transform: `translate3d(${left - width - pad}px, ${top}px, 0)`
    })
  }, [anchor, tip])

  return style
}
