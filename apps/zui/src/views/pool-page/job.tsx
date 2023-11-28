import ProgressIndicator from "src/js/components/ProgressIndicator"
import styles from "./job.module.css"
import {IconButton} from "src/components/icon-button"
import {ThreeUpArrows} from "./three-up-arrows"
import {Icon} from "src/components/icon"
import {ReactNode} from "react"

type JobStatus = "loading" | "error" | "success" | "aborted"

export function Job(props: {
  name: string
  progress: number
  onCancel: () => any
  message: string
  status: JobStatus
  details: string | string[] | ReactNode
}) {
  const isLoading = props.status === "loading"
  return (
    <div className={styles.job}>
      <div className={styles.icon}>
        <JobIcon status={props.status} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{props.name}</div>
        {isLoading && (
          <div className={styles.progress}>
            <ProgressIndicator percent={props.progress} />
          </div>
        )}
        <div className={styles.status}>{props.message}</div>
      </div>
      <div className={styles.actions}>
        <IconButton
          iconSize={18}
          iconName="close"
          click={props.onCancel}
          className={styles.cancel}
        />
      </div>
      {props.details && <div className={styles.details}>{props.details}</div>}
    </div>
  )
}

function JobIcon(props: {status: JobStatus}) {
  switch (props.status) {
    case "loading":
      return (
        <div className={styles.loadingIcon}>
          <ThreeUpArrows />
        </div>
      )
    case "success":
      return (
        <div className={styles.successIcon}>
          <Icon name="check" fill="white" />
        </div>
      )
    case "error":
    case "aborted":
      return (
        <div className={styles.errorIcon}>
          <Icon name="close" fill="white" size={26} />
        </div>
      )
  }
}
