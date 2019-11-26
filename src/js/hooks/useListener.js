/* @flow */
import {useEffect} from "react"

export default function useListener(
  el: ?Node,
  event: string,
  callback: Function,
  opts: boolean | Object = false
) {
  useEffect(() => {
    el && el.addEventListener(event, callback, opts)
    return () => {
      if (el) el.removeEventListener(event, callback, opts)
    }
  }, [el])
}
