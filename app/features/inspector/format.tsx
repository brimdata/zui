import React, {ReactNode} from "react"

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
    <a className="inspector-collpased" onClick={onClick}>
      {n}
    </a>
  )
}

export function expanded(n: ReactNode[], onClick: React.MouseEventHandler) {
  return (
    <a className="inspector-expanded" onClick={onClick}>
      {n}
    </a>
  )
}
