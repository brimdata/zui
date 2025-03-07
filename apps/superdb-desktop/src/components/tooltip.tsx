import {useRef, useState} from "react"
import useListener from "../js/components/hooks/useListener"
import {Debut, useDebut} from "./debut"
import styles from "./tooltip.module.css"
import {useFixedPosition} from "src/util/hooks/use-fixed-position"
import {findAncestor} from "src/util/find-ancestor"

const attr = "data-tooltip"

export function Tooltip() {
  const [title, setTitle] = useState(null)
  const [anchor, setAnchor] = useState(null)
  const ref = useRef()

  function set(node: Element) {
    debut.cancelExit()
    setAnchor(node)
    setTitle(node.getAttribute(attr))
  }

  function reset() {
    setAnchor(null)
    setTitle(null)
  }

  function needsTooltip(node: Element) {
    return node.matches(`[${attr}]`)
  }

  const debut = useDebut({afterExit: reset})

  useListener(document.body, "mouseover", (e: any) => {
    const node = findAncestor(e.target, needsTooltip)
    if (node) set(node)
    else if (!debut.isExiting) debut.exit()
  })

  const style = useFixedPosition({
    targetRef: ref,
    anchor: anchor,
    anchorPoint: "bottom center",
    targetPoint: "top center",
    targetMargin: "3px",
    overflow: "flip",
  })

  if (!anchor) return null
  return (
    <Debut {...debut.props} classNames="tooltip">
      <div ref={ref} style={style} className={styles.tooltip}>
        {title}
      </div>
    </Debut>
  )
}
