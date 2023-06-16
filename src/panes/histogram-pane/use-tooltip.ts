import {useState} from "react"

export function useTooltip() {
  const tooltipWidth = 180
  const [style, setStyle] = useState({width: tooltipWidth})
  const [data, setData] = useState(null)
  return {
    data,
    setData,
    style,
    hide: () => setStyle((s) => ({...s, opacity: 0})),
    show: () => setStyle((s) => ({...s, opacity: 1})),
    move: (e: PointerEvent) => {
      const y = 0
      const x = 0
      const xPadding = 30
      const yPadding = -20
      const overflowsRight =
        e.pageX + xPadding + tooltipWidth >= document.body.clientWidth
      if (overflowsRight) {
        const xPos = x - tooltipWidth - xPadding
        const transform = `translate(${xPos}px, ${y + yPadding}px)`
        setStyle((s) => ({...s, transform}))
      } else {
        const transform = `translate(${x + xPadding}px, ${y + yPadding}px)`
        setStyle((s) => ({...s, transform}))
      }
    },
  }
}
