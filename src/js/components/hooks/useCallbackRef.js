/* @flow */
import {useCallback, useState} from "react"

export default function useCallbackRef<T>(): [T | null, Function] {
  let [node, setNode] = useState<T | null>(null)

  let cb = useCallback((node: T | null) => {
    if (node !== null) {
      setNode(node)
    }
  })

  return [node, cb]
}
