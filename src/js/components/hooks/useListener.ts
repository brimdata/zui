import {useEffect, useRef} from "react"

export default function useListener<T>(
  el: Node | null | undefined,
  event: keyof DocumentEventMap | "cancel" | "nativeContextMenu",
  callback: (e: T) => void,
  opts: boolean | Object = false
) {
  const savedCallback = useRef<(e: T) => void>(() => {})

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const listener = (e) => savedCallback.current(e)
    el && el.addEventListener(event, listener, opts)
    return () => {
      if (el) el.removeEventListener(event, listener, opts)
    }
  }, [el, event])
}
