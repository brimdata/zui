import styles from "./histogram-pane.module.css"

export function Error(props: {message: string}) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <p>{props.message}</p>
      </div>
    </div>
  )
}
