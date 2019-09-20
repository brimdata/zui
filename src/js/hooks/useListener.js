/* @flow */
import {useEffect} from "react"

export default function useListener(
  el: Node,
  event: string,
  callback: Function,
  opts: boolean | Object = false
) {
  useEffect(() => {
    el.addEventListener(event, callback, opts)
    return () => el.removeEventListener(event, callback, opts)
  }, [])
}
