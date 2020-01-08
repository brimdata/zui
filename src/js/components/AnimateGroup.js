/* @flow */
import React, {useEffect, useRef} from "react"

import {uniqBy} from "../lib/Array"

type Props = {children: *}

export default function AnimateGroup({children}: Props) {
  let previousChildren = useRef(children)

  let next = React.Children.toArray(children)
  let prev = React.Children.toArray(previousChildren.current)
  let all = uniqBy(prev.concat(next), (child) => child.key)

  useEffect(() => {
    previousChildren.current = children
  })

  let ret = all.map<*>((child) => {
    let nextChild = next.find((n) => n.key === child.key)
    let prevChild = prev.find((p) => p.key === child.key)

    let hasNext = !!nextChild
    let hasPrev = !!prevChild
    let isLeaving = prevChild && !prevChild.props.show

    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log("entering", child.key)
      return React.cloneElement(child, {show: true})
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log("leaving", key)
      return React.cloneElement(child, {show: false})
    } else if (hasNext && hasPrev && React.isValidElement(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log("unchanged", key)
      return React.cloneElement(child, {
        show: prevChild && prevChild.props.show
      })
    }
  })

  return ret
}
