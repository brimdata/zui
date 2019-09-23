/* @flow */
import {useLayoutEffect} from "react"
import anime from "animejs"

import {isArray} from "../lib/is"

export default function useAnime(props: Object, reverse: boolean = false) {
  useLayoutEffect(() => {
    if (reverse) {
      let a = buildTimeline(props)
      a.reverse()
      a.restart()
    } else {
      buildTimeline(props).play()
    }
  }, [reverse])
}

function buildTimeline(props) {
  if (isArray(props)) {
    return props.reduce(
      (ani, props) => ani.add(props, props.offset),
      anime.timeline()
    )
  } else {
    return anime(props)
  }
}
