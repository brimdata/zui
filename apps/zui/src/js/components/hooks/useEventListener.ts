import {useEffect} from "react"

// DO NOT USE use useListener instead
export default function useEventListener(
  el: EventTarget,
  name: string,
  callback: EventListenerOrEventListenerObject,
  deps: any[] | null | undefined
) {
  useEffect(() => {
    el.addEventListener(name, callback, false)
    return () => el.removeEventListener(name, callback, false)
  }, deps)
}
