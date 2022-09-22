import {UIEvent, useEffect} from "react"
import useCallbackRef from "./useCallbackRef"
import useListener from "./useListener"

export function useScrollShadow() {
  const [ref, setRef] = useCallbackRef()

  useEffect(() => {
    console.log("hey", ref)
    ref?.classList.add("scroll-shadow")
    return () => {
      ref?.classList.remove("scroll-shadow")
    }
  }, [ref])

  useListener(ref, "scroll", (e: UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      e.currentTarget.classList.remove("scroll-shadow-show")
    } else {
      e.currentTarget.classList.add("scroll-shadow-show")
    }
  })

  return setRef
}
