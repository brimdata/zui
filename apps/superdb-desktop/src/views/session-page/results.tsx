import {HistogramPane} from "../histogram-pane"
import {ResultsPane} from "../results-pane"
import styles from "./results.module.css"

export function Results() {
  return (
    <div className={styles.container}>
      <HistogramPane />
      <ResultsPane />
    </div>
  )
}
