import {useMemo} from "react"
import useResizeObserver from "use-resize-observer"

export function useParentSize() {
  const {ref, width, height} = useResizeObserver()

  const Parent = useMemo(() => {
    return function Parent({children}) {
      return (
        <div style={{position: "relative", height: "100%", width: "100%"}}>
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "0",
              top: "0",
              pointerEvents: "none",
            }}
            ref={ref}
          />
          {children}
        </div>
      )
    }
  }, [ref])

  return {Parent, width, height}
}
