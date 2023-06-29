import {useState} from "react"

export function useTooltip() {
  const tooltipWidth = 200
  const yPad = -60
  const xPad = 20
  const [style, setStyle] = useState({width: tooltipWidth})
  const [data, setData] = useState(null)
  const updateStyle = (css) => setStyle((prev) => ({...prev, ...css}))
  const translate = (x: number, y: number) =>
    updateStyle({transform: `translate(${x}px, ${y}px)`})

  return {
    data,
    setData,
    style,
    hide: () => updateStyle({opacity: 0}),
    show: () => updateStyle({opacity: 1}),
    move: (e: PointerEvent) => {
      const brush = e.currentTarget as SVGGElement
      const {y} = brush.getBoundingClientRect()
      const x = e.pageX
      const docWidth = document.body.clientWidth
      if (x + xPad + tooltipWidth < docWidth) {
        translate(x + xPad, y + yPad)
      } else {
        translate(x - tooltipWidth - xPad, y + yPad)
      }
    },
  }
}
