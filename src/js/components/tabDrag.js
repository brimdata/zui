/* @flow */
import lib from "../lib"

export default function(
  event: MouseEvent,
  index: number,
  width: number,
  count: number
) {
  let clickX = event.clientX
  let callbacks = new Map()
  let started = false
  let dest = index
  let startId = null

  function emit(name, ...args) {
    let cb = callbacks.get(name)
    if (cb) cb(...args)
  }

  function move(e) {
    if (!started) {
      emit("start")
      started = true
    }
    let delta = e.clientX - clickX
    let mid = width * index + width / 2
    dest = Math.max(0, Math.min(Math.floor((mid + delta) / width), count))
    emit("hover", dest)
    emit("drag", delta)
  }

  function up() {
    lib.off("mousemove", move)
    lib.off("mouseup", up)
    if (started) emit("end", index, dest)
    else clearTimeout(startId)
  }

  startId = setTimeout(() => lib.on("mousemove", move), 80)
  lib.on("mouseup", up)

  return {
    start(fn: Function) {
      callbacks.set("start", fn)
      return this
    },
    drag(fn: Function) {
      callbacks.set("drag", fn)
      return this
    },
    hover(fn: Function) {
      callbacks.set("hover", fn)
      return this
    },
    end(fn: Function) {
      callbacks.set("end", fn)
      return this
    }
  }
}
