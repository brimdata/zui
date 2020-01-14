/* @flow */
import lib from "../../lib"

let id = 1
export default function useDrag(handler: Function) {
  id++
  return (args: Object) => {
    let startX = 0

    function onMouseDown(event: MouseEvent) {
      startX = event.clientX
      handler({
        event,
        args,
        dx: 0,
        type: "down"
      })
      lib.on("mousemove", onMove)
      lib.on("mouseup", onUp)
    }

    function onMove(event) {
      handler({
        event,
        args,
        dx: event.clientX - startX,
        type: "move"
      })
    }

    function onUp(event) {
      handler({
        event,
        args,
        dx: event.clientX - startX,
        type: "up"
      })
      lib.off("mousemove", onMove)
      lib.off("mouseup", onUp)
    }

    return {
      onMouseDown
    }
  }
}
