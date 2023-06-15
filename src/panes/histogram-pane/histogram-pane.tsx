import {useSelector} from "react-redux"
import styles from "./histogram-pane.module.css"
import Layout from "src/js/state/Layout"
import {SettingsButton} from "./settings-button"
import {useParentSize} from "src/util/hooks/use-parent-size"
import {AppHistogram} from "./app-histogram"

export function HistogramPane() {
  const {Parent, width, height} = useParentSize()
  const show = useSelector(Layout.getShowHistogram)

  if (!show) return null

  return (
    <Parent>
      <div className={styles.pane} data-testid="histogram">
        <AppHistogram width={width} height={height} />
        <SettingsButton />
      </div>
    </Parent>
  )
}
