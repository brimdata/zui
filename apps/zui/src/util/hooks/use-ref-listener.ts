import {useEffect} from "react"

export function useRefListener(ref, event, callback) {
  useEffect(() => {
    ref.current?.addEventListener(event, callback)
    return () => {
      ref.current?.removeEventListener(event, callback)
    }
  }, [callback])
}
