import {useCallback, useState} from "react"

export default function useCallbackRef() {
  const [node, setNode] = useState(null)

  const cb = useCallback((node) => {
    if (node !== null) {
      setNode(node)
    }
  }, [])

  return [node, cb]
}
