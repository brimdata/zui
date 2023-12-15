import {useLayoutEffect, useState} from "react"
import useListener from "src/js/components/hooks/useListener"
import {CSSProperties} from "react"
import {fixedPositioner} from "../fixed-positioner"

type Props = Parameters<typeof fixedPositioner>[0]

export function useFixedPosition(props: Props) {
  const [style, setStyle] = useState<CSSProperties>({
    top: 0,
    left: 0,
    position: "fixed",
  })

  function run() {
    if (!props.target) return
    setStyle((prev) => ({...prev, ...fixedPositioner(props)}))
  }

  useLayoutEffect(run, Object.values(props))
  useListener(global.window, "resize", run)

  return style
}
