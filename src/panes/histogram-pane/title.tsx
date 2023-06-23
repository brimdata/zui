import PoolSettings from "src/js/state/PoolSettings"
import styles from "./histogram-pane.module.css"
import {useSelector} from "react-redux"
import {State} from "src/js/state/types"
import Current from "src/js/state/Current"
import Histogram from "src/js/state/Histogram"
import * as d3 from "d3"

// Make all this data change together
// The null count should not appear if there is no data

export function Title() {
  const poolId = useSelector(Current.getPoolFromQuery)?.id
  const {timeField, colorField} = useSelector((s: State) =>
    PoolSettings.findWithDefaults(s, poolId)
  )
  const nullCount = useSelector(Histogram.getNullCount)
  const format = d3.format(",")
  return (
    <p className={styles.title}>
      {nullCount !== 0 && (
        <>
          <b>
            {format(nullCount)} null <i>{timeField}</i> values
          </b>
          {" • "}
        </>
      )}
      counts by <i>{timeField}</i> and <i>{colorField}</i>
    </p>
  )
}
