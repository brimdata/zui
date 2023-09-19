import {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react"
import {bounded} from "src/util/bounded"
import {useMemoObject} from "src/util/hooks/use-memo-object"
import useResizeObserver from "use-resize-observer"

export function useResponsiveMenu<T>(items: T[]) {
  const containerRef = useRef<any>() // attach this to the button group container, not the button group
  const moreRef = useRef<any>()

  const [measurements, setMeasurements] = useState([])
  const [moreWidth, setMoreWidth] = useState(0)
  const [sliceAt, setSliceAt] = useState(items.length)
  const [measuring, setMeasuring] = useState(true)

  const hiddenItems = useMemo(
    () => items.slice(sliceAt, items.length),
    [sliceAt, items]
  )
  const hasHiddenItems = hiddenItems.length > 0

  function onResize(width: number) {
    if (!containerRef.current) return

    let sliceIndex = items.length

    for (let i = 0; i < measurements.length; i++) {
      const rightEdge = measurements[i]
      const prevRightEdge = measurements[i - 1] ?? 0
      if (rightEdge <= width) continue
      if (prevRightEdge + moreWidth <= width) {
        sliceIndex = i
        break
      } else {
        sliceIndex = i - 1
        break
      }
    }
    setSliceAt(bounded(sliceIndex, [0, items.length]))
  }

  function measure() {
    const container = containerRef.current
    if (!container) return
    const buttonParent = container.children[0] as HTMLElement
    const edges = getRightEdges(buttonParent)
    setMeasurements(edges)
    setMeasuring(false)
  }

  function reset() {
    setMeasuring(true)
    setMeasurements([])
    setSliceAt(items.length)
  }

  useLayoutEffect(() => {
    reset()
  }, [items])

  useLayoutEffect(() => {
    if (measuring) {
      measure()
      setMeasuring(false)
    } else {
      onResize(containerRef.current?.clientWidth)
    }
  }, [measuring])

  useLayoutEffect(() => {
    if (hiddenItems.length > 0) {
      setMoreWidth(moreRef.current?.clientWidth ?? 0)
    }
  }, [hiddenItems.length])

  useResizeObserver({
    ref: containerRef,
    onResize: ({width}) => onResize(width),
  })

  const isHidden = useCallback(
    (item) => {
      if (measuring) return false
      else return hiddenItems.indexOf(item) != -1
    },
    [hiddenItems, measuring]
  )

  return useMemoObject({
    items,
    isHidden,
    hiddenItems,
    hasHiddenItems,
    containerRef,
    moreRef,
  })
}

function getRightEdges(parent: HTMLElement) {
  const parentBox = parent.getBoundingClientRect()
  const rightEdges = []
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i]
    const box = child.getBoundingClientRect()
    const left = box.left - parentBox.left
    const right = left + box.width
    rightEdges.push(right)
  }
  return rightEdges
}
