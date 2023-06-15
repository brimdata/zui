import styles from "./histogram-pane.module.css"

export function HistogramError(props: {message: string}) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <p>
          <b>Histogram Error</b>
        </p>
        <p>{props.message}</p>
      </div>
    </div>
  )
}
