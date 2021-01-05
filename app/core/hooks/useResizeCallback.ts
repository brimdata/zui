import {useState, useLayoutEffect} from "react"

type Callback = (DOMRectReadOnly) => void

export default function useResizeCallback(
  cb: Callback
): (node: HTMLElement) => void {
  const [node, setNode] = useState(null)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      cb(entry.contentRect)
    })
    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return setNode
}
