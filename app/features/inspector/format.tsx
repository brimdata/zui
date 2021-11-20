import React, {ReactNode} from "react"
import Arrow from "src/js/icons/Arrow"
import {zed} from "zealot"

export function key(key: string | zed.Field) {
  const s = key instanceof zed.Field ? key.name : key
  return (
    <span key={key.toString()} className="zed-key">
      {s}:{" "}
    </span>
  )
}

export function collapsed(n: ReactNode[], onClick: React.MouseEventHandler) {
  return (
    <a key={"collapsed"} className="inspector-collapsed" onClick={onClick}>
      <Arrow /> {n}
    </a>
  )
}

export function expanded(props: {
  children: ReactNode
  onClick: React.MouseEventHandler
}) {
  return (
    <a key="expanded" className="inspector-expanded" onClick={props.onClick}>
      <Arrow /> {props.children}
    </a>
  )
}
