import {useCallback, useState} from "react"

export default function useCallbackRef<T = Element>(): [
  T,
  (e: T | null) => void
] {
  const [node, setNode] = useState(null)

  const cb = useCallback((node) => {
    if (node !== null) {
      setNode(node)
    }
  }, [])

  return [node, cb]
}
