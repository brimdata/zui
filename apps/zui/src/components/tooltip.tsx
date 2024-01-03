import {useLayoutEffect, useRef, useState} from "react"
import useListener from "../js/components/hooks/useListener"
import styles from "./tooltip.module.css"
import {fixedPositioner} from "src/util/fixed-positioner"

const attr = "data-tooltip"

export function Tooltip() {
  const [title, setTitle] = useState(null)
  const [anchor, setAnchor] = useState(null)
  const [style, setStyle] = useState({top: 0, left: 0})
  const ref = useRef()
  useListener(document.body, "mouseover", (e: any) => {
    let node = e.target
    while (node) {
      if (node instanceof HTMLElement && node.hasAttribute(attr)) {
        setTitle(node.getAttribute(attr))
        setAnchor(node)
        return
      }
      node = node.parentNode
    }
    setTitle(null)
    setAnchor(null)
  })

  useLayoutEffect(() => {
    if (anchor && title && ref.current) {
      const style = fixedPositioner({
        target: ref.current,
        anchor: anchor,
        anchorPoint: "bottom center",
        targetPoint: "top center",
        targetMargin: "2px",
        overflow: "flip",
      })
      setStyle(style)
    }
  }, [anchor, title])

  if (!anchor) return null

  return (
    <div ref={ref} className={styles.tooltip} style={style}>
      {title}
    </div>
  )
}
