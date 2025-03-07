import {useCallback, useState} from "react"

export default function useCallbackRef<T = HTMLElement>(): [
  T,
  (e: T | null) => T | null
] {
  const [node, setNode] = useState(null)

  const cb = useCallback((node: any) => {
    if (node !== null) setNode(node)
    return node
  }, [])

  return [node, cb]
}
