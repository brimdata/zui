import PoolSettings from "src/js/state/PoolSettings"
import styles from "./histogram-pane.module.css"
import {useSelector} from "react-redux"
import {State} from "src/js/state/types"
import Current from "src/js/state/Current"
import Histogram from "src/js/state/Histogram"
import * as d3 from "d3"
import {Fragment} from "react"

// Make all this data change together
// The null count should not appear if there is no data

export function Title() {
  const poolId = useSelector(Current.getPoolFromQuery)?.id
  const {timeField, colorField} = useSelector((s: State) =>
    PoolSettings.findWithDefaults(s, poolId)
  )
  const nullCount = useSelector(Histogram.getNullXCount)
  const missingCount = useSelector(Histogram.getMissingXCount)
  const format = d3.format(",")

  const content = []

  if (nullCount) {
    content.push(
      <Fragment key="1">
        {format(nullCount)} null {timeField} values •{" "}
      </Fragment>
    )
  }
  if (missingCount) {
    content.push(
      <Fragment key="2">
        {format(missingCount)} missing {timeField} values •{" "}
      </Fragment>
    )
  }

  content.push(
    <Fragment key="3">
      counts by <i>{timeField}</i> and <i>{colorField}</i>
    </Fragment>
  )

  return <p className={styles.title}>{content}</p>
}
