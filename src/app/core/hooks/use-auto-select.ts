import {RefObject, useLayoutEffect} from "react"

export function useAutoSelect(ref: RefObject<HTMLInputElement>) {
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.select()
    }
  }, [])
}
