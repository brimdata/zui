import * as d3 from "d3"

export default ({
  parent,
  onDragStart = () => {},
  onDrag = () => {},
  onDragEnd = () => {}
}) => {
  let startPos = null

  const mouseDown = () => {
    startPos = d3.mouse(parent)[0]
    onDragStart(startPos)
  }

  const mouseMove = () => {
    if (startPos === null) return
    const pos = d3.mouse(parent)[0]
    onDrag(pos, startPos)
  }

  const mouseUp = () => {
    if (startPos === null) return
    const pos = d3.mouse(parent)[0]
    onDragEnd(pos, startPos)
    startPos = null
  }

  return {
    mouseDown,
    mouseUp,
    mouseMove
  }
}
