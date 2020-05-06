/* @flow */
import {useEffect} from "react"

export default function useEventListener(
  el: Node,
  name: string,
  callback: Function,
  deps: ?(*[])
) {
  useEffect(() => {
    el.addEventListener(name, callback, false)
    return () => el.removeEventListener(name, callback, false)
  }, deps)
}
