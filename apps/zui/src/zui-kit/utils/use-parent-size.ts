import {MutableRefObject, useEffect, useState} from "react"

export function useParentSize<T extends HTMLElement>(ref: MutableRefObject<T>) {
  const [{height, width}, setSize] = useState({width: 10, height: 10})

  useEffect(() => {
    const el = ref.current
    const parent = el.parentElement
    const ro = new ResizeObserver((e) => {
      const {height, width} = e[0].contentRect
      setSize({height, width})
    })
    ro.observe(parent)
    return () => {
      ro.unobserve(parent)
      ro.disconnect()
    }
  }, [])

  return {height, width}
}
