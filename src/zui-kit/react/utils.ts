import {MutableRefObject, useEffect, useRef} from "react"

function useListener<T>(
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

export function useOnScroll(
  ref: MutableRefObject<HTMLDivElement>,
  onScrollCallback: (pos: {top: number; left: number}) => void
) {
  const onScroll = () => {
    if (onScrollCallback && ref.current) {
      const top = ref.current.scrollTop
      const left = ref.current.scrollLeft
      onScrollCallback({top, left})
    }
  }

  useListener(ref.current, "scroll", onScroll)
}

export function useInitialScrollPosition(
  ref: MutableRefObject<HTMLDivElement>,
  position?: {top: number; left: number}
) {
  useEffect(() => {
    const el = ref.current
    let id
    if (position && el) {
      el.scrollTop = position.top
      // First scroll down so that the rows can render, then scroll to the right
      id = setTimeout(() => {
        el.scrollLeft = position.left
      })
    }
    return () => clearTimeout(id)
  }, [])
}

type AnyRef = React.MutableRefObject<any> | React.RefCallback<any> | null

export function mergeRefs(...refs: AnyRef[]) {
  return (instance: any) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance)
      } else if (ref != null) {
        ref.current = instance
      }
    })
  }
}
