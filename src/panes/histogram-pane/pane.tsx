import {useSelector} from "react-redux"
import styles from "./histogram-pane.module.css"
import Layout from "src/js/state/Layout"
import {SettingsButton} from "./settings-button"
import {useParentSize} from "src/util/hooks/use-parent-size"
import {Histogram} from "./histogram"
import {Toolbar} from "src/components/toolbar"
import {Title} from "./title"

export function HistogramPane() {
  const {Parent, width, height} = useParentSize()
  const show = useSelector(Layout.getShowHistogram)

  if (!show) return null

  return (
    <div className={styles.pane} data-testid="histogram">
      <Parent>
        <Toolbar reverse className={styles.toolbar}>
          <SettingsButton />
          <Title />
        </Toolbar>
        <Histogram width={width} height={height} />
      </Parent>
    </div>
  )
}
