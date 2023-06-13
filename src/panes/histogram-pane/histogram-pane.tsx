import {useSelector} from "react-redux"
import styles from "./histogram-pane.module.css"
import useResizeObserver from "use-resize-observer"
import Histogram from "src/js/state/Histogram"
import Layout from "src/js/state/Layout"
import {useMemo, useState} from "react"
import {SettingsButton} from "./settings-button"
import {StackedHistogram} from "./stacked-histogram"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import submitSearch from "src/app/query-home/flows/submit-search"
import useSelect from "src/app/core/hooks/use-select"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import * as d3 from "d3"
import {Tooltip} from "./tooltip"

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
  const interval = useSelector(Histogram.getInterval)
  const data = useSelector(Histogram.getData)
  const jsData = useMemo(() => data.map((d) => d.toJS()), [data])
  const dispatch = useDispatch()
  const select = useSelect()
  const [tooltipStyle, setTooltipStyle] = useState({})

  if (!show) return null
  if (!range) return null
  if (!interval) return null

  function onBrushMove() {
    setTooltipStyle((s) => ({...s, opacity: 0}))
  }

  function onBrushEnd([from, to]: [Date, Date]) {
    const poolId = select(Current.getPoolFromQuery)?.id
    const settings = select((s) => PoolSettings.find(s, poolId))
    const field = settings?.timeField ?? "ts"
    dispatch(Editor.setTimeRange({field, from, to}))
    dispatch(submitSearch())
  }

  function onPointerMove(e) {
    const [x] = d3.pointer(e)
    setTooltipStyle((s) => ({...s, transform: `translateX(${x}px)`}))
  }

  function onPointerLeave() {
    setTooltipStyle((s) => ({...s, opacity: 0}))
  }

  function onPointerEnter() {
    setTooltipStyle((s) => ({...s, opacity: 1}))
  }

  return (
    <Parent>
      <div className={styles.pane} data-testid="histogram">
        {range && (
          <StackedHistogram
            width={width}
            height={height}
            range={range}
            interval={interval}
            data={jsData}
            onBrushEnd={onBrushEnd}
            onBrushMove={onBrushMove}
            onBrushPointerMove={onPointerMove}
            onBrushPointerEnter={onPointerEnter}
            onBrushPointerLeave={onPointerLeave}
          />
        )}
        <Tooltip style={tooltipStyle} />
        <SettingsButton />
      </div>
    </Parent>
  )
}
