import {useEffect, useRef} from "react"

export default function useListener<T>(
  et: EventTarget | null | undefined,
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
    et && et.addEventListener(event, listener, opts)
    return () => {
      if (et) et.removeEventListener(event, listener, opts)
    }
  }, [et, event])
}
