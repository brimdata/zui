import {useRef} from "react"
import {useRefListener} from "./use-ref-listener"

export function useDocListener(event, callback) {
  const ref = useRef(document)
  return useRefListener(ref, event, callback)
}
