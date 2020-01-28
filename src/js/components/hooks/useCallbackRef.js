/* @flow */
import {useCallback, useState} from "react"

export default function useCallbackRef() {
  let [node, setNode] = useState(null)

  let cb = useCallback((node: ?HTMLElement) => {
    if (node !== null) {
      setNode(node)
    }
  })

  return [node, cb]
}
