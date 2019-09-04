/* @flow */
import {useRef, useState} from "react"
import classNames from "classnames"

import useListener from "../../hooks/useListener"

export default function useInputClassNames(...classes: *[]) {
  let [focus, setFocus] = useState(false)
  let ref = useRef<HTMLElement | null>(null)
  let className = classNames(...classes, {focus})

  useListener(ref, "focus", () => setFocus(true))
  useListener(ref, "blur", () => setFocus(false))

  return {
    className,
    ref
  }
}
