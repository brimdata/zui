import {scaleLinear} from "d3"
import {CSSProperties, HTMLAttributes, useRef, useState} from "react"
import useResizeObserver from "use-resize-observer"
import styles from "./scroll-shadow.module.css"
import classNames from "classnames"

function getShadowOpacities(element: Element, threshold: number) {
  const scale = scaleLinear()
    .range([0, 1]) // the opacity
    .domain([0, threshold]) // the scroll top/bottom distance
    .clamp(true) // Don't ever exceed the range

  const {scrollHeight, clientHeight, scrollTop} = element
  const scrollBottom = Math.round(scrollHeight - clientHeight - scrollTop)

  return {top: scale(scrollTop), bottom: scale(scrollBottom)}
}

export function useScrollShadow(threshold: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(0)
  const [bottom, setBottom] = useState(0)

  function calculate() {
    if (ref.current) {
      const {top, bottom} = getShadowOpacities(ref.current, threshold)
      setTop(top)
      setBottom(bottom)
    }
  }

  useResizeObserver({ref, onResize: calculate})

  return {
    ref,
    onScroll: calculate,
    top,
    bottom,
  }
}

type Props = {threshold?: number}

export function TopShadow(props: {opacity: number; style?: CSSProperties}) {
  return (
    <div
      className={classNames(styles.shadow, styles.top)}
      style={{...props.style, opacity: props.opacity}}
    />
  )
}

export function BottomShadow(props: {opacity: number}) {
  return (
    <div
      className={classNames(styles.shadow, styles.bottom)}
      style={{opacity: props.opacity}}
    />
  )
}

export function ScrollShadow(props: HTMLAttributes<HTMLDivElement> & Props) {
  const {children, className, ...rest} = props
  const {ref, onScroll, top, bottom} = useScrollShadow(props.threshold ?? 30)

  return (
    <div {...rest} className={classNames(styles.container)}>
      <TopShadow opacity={top} />
      <div
        className={classNames(styles.shadow, styles.top)}
        style={{opacity: top}}
      />
      <div
        className={classNames(styles.scroll, className)}
        onScroll={onScroll}
        ref={ref}
      >
        {children}
      </div>
      <BottomShadow opacity={bottom} />
    </div>
  )
}
