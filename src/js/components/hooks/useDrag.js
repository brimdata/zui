/* @flow */
import lib from "../../lib"

export default function useDrag(handler: Function) {
  return (args: Object) => {
    let startX = 0

    function onMouseDown(e: MouseEvent) {
      startX = e.clientX
      lib.on("mousemove", onMove)
      lib.on("mouseup", onUp)
    }

    function onUp() {
      lib.off("mousemove", onMove)
    }

    function onMove(event) {
      handler({
        event,
        args,
        dx: event.clientX - startX
      })
    }

    return {
      onMouseDown
    }
  }
}
