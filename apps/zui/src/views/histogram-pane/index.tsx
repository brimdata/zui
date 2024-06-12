import {useSelector} from "react-redux"
import styles from "./histogram-pane.module.css"
import Layout from "src/js/state/Layout"
import {SettingsButton} from "./settings-button"
import {useParentSize} from "src/util/hooks/use-parent-size"
import {Histogram} from "./histogram"
import HistogramState from "src/js/state/Histogram"
import {Toolbar} from "src/components/toolbar"
import {Title} from "./title"
import {Resizer} from "./resizer"
import {useRef} from "react"
import QueryInfo from "src/js/state/QueryInfo"

export function HistogramPane() {
  const {Parent, width = 0, height = 0} = useParentSize()
  const show = useSelector(Layout.getShowHistogram)
  const chartHeight = useSelector(Layout.getChartHeight)
  const parseError = useSelector(QueryInfo.getParseError)
  const canRender = useSelector(HistogramState.getCanRender)
  const ref = useRef<HTMLDivElement>()
  if (!show || !canRender || parseError) return null

  return (
    <div
      className={styles.pane}
      data-testid="histogram"
      style={{height: chartHeight}}
      ref={ref}
    >
      <Parent>
        <Toolbar reverse className={styles.toolbar}>
          <SettingsButton />
          <Title />
        </Toolbar>
        <Histogram width={width} height={height} />
      </Parent>
      <Resizer outerRef={ref} />
    </div>
  )
}
