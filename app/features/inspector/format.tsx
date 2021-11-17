import React, {ReactNode} from "react"
import Arrow from "src/js/icons/Arrow"

export function key(name: string) {
  return <span className="inspector-key">{name}: </span>
}

export function unset() {
  return <span className="inspector-null">null</span>
}

export function string(s: string) {
  return <span className="inspector-string">&quot;{s}&quot;</span>
}

export function ip(s: string) {
  return <span className="inspector-ip">{s}</span>
}

export function int(s: string) {
  return <span className="inspector-int">{s}</span>
}

export function collapsed(n: ReactNode[], onClick: React.MouseEventHandler) {
  return (
    <a className="inspector-collapsed" onClick={onClick}>
      <Arrow /> {n}
    </a>
  )
}

export function expanded(props: {
  children: ReactNode
  onClick: React.MouseEventHandler
}) {
  return (
    <a className="inspector-expanded" onClick={props.onClick}>
      <Arrow /> {props.children}
    </a>
  )
}
