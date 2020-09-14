import anime, {AnimeInstance} from "animejs"

import {isObject, isFunction} from "lodash"

export default function animation(el: HTMLElement | null, opts: unknown) {
  function initialize(): AnimeInstance {
    if (!opts) return anime({targets: el, duration: 0})

    if (isObject(opts)) return anime({targets: el, ...opts})

    if (isFunction(opts)) return opts(anime, el)

    throw new Error("No animation provided")
  }

  function getTargets(ani) {
    return ani.children.reduce(
      (all, one) => all.concat(getTargets(one)),
      ani.animatables.map((a) => a.target)
    )
  }

  const ani = initialize()
  ani.pause()

  return {
    play() {
      ani.restart()
      ani.play()
      return ani.finished
    },

    cancel() {
      if (ani) getTargets(ani).map(anime.remove)
      return this
    },

    reverse() {
      ani.reverse()
      return this
    },

    seekToEnd() {
      ani.restart()
      ani.seek(ani.duration)
      return this
    }
  }
}
