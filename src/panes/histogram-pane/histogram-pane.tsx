import {useSelector} from "react-redux"
import styles from "./histogram-pane.module.css"
import useResizeObserver from "use-resize-observer"
import Histogram from "src/js/state/Histogram"
import Layout from "src/js/state/Layout"
import {MainHistogramSvg} from "src/app/query-home/histogram/MainHistogram/Chart"
import {useMemo} from "react"
import {SettingsButton} from "./settings-button"

function useParentSize() {
  const {ref, width, height} = useResizeObserver()

  const Parent = useMemo(() => {
    return function Parent({children}) {
      return (
        <div style={{position: "relative", height: "100%", width: "100%"}}>
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "0",
              top: "0",
            }}
            ref={ref}
          />
          {children}
        </div>
      )
    }
  }, [ref])

  return {Parent, width, height}
}

export function HistogramPane() {
  const {Parent, width, height} = useParentSize()
  const show = useSelector(Layout.getShowHistogram)
  const range = useSelector(Histogram.getRange)
  if (!show) return null
  return (
    <Parent>
      <div className={styles.pane} data-testid="histogram">
        {range && (
          <MainHistogramSvg width={width} height={height} range={range} />
        )}
        <SettingsButton />
      </div>
    </Parent>
  )
}
