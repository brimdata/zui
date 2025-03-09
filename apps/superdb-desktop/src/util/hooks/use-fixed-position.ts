import {MutableRefObject, useLayoutEffect, useState} from "react"
import useListener from "src/js/components/hooks/useListener"
import {CSSProperties} from "react"
import {fixedPositioner} from "../fixed-positioner"

type Props = Partial<Parameters<typeof fixedPositioner>[0]> & {
  target?: HTMLElement
  targetRef?: MutableRefObject<Element>
}

export function useFixedPosition(props: Props) {
  const [style, setStyle] = useState<CSSProperties>({top: 0, left: 0})

  function calculate() {
    const target = props.target || props.targetRef?.current
    if (!target) return
    setStyle(fixedPositioner({...props, target}))
  }

  useLayoutEffect(calculate, Object.values(props))
  useListener(global.window, "resize", calculate)

  return style
}
