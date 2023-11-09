import {ResultsPane} from "../results-pane"
import styles from "./results.module.css"
import {ResultsProvider} from "src/app/query-home"
export function Results() {
  return (
    <div className={styles.container}>
      <ResultsProvider>
        <ResultsPane />
      </ResultsProvider>
    </div>
  )
}
