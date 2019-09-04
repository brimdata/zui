/* @flow */
import {useEffect} from "react"

export default function useListener(
  ref: *,
  event: string,
  cb: Function,
  opts: boolean | Object = false
) {
  useEffect(() => {
    let el = ref.current
    if (!el) return
    el.addEventListener(event, cb, opts)
    return () => {
      el.removeEventListener(event, cb, opts)
    }
  }, [])
}
