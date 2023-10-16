import {useSelector} from "react-redux"
import Loads from "src/js/state/Loads"
import {State} from "src/js/state/types"
import {Job} from "./job"
import styles from "./recent-loads.module.css"
import {useDispatch} from "src/app/core/state"
import {invoke} from "src/core/invoke"
import {LoadModel} from "src/domain/loads/load-model"
import * as fmt from "date-fns"
import {ErrorLines} from "src/components/errors-lines"

export function RecentLoads(props: {id: string}) {
  const loads = useSelector((s: State) => Loads.wherePoolId(s, props.id))
  const dispatch = useDispatch()

  const cancelLoad = async (load) => {
    if (
      load.status == "loading" &&
      confirm("Are you sure you want to abort this load?")
    ) {
      await invoke("loads.abort", load.id)
    } else {
      dispatch(Loads.delete(load.id))
    }
  }

  if (loads.length === 0) return null

  return (
    <section className={styles.recentLoads}>
      <h2 className={styles.title}>Recent Loads</h2>
      <div className={styles.list}>
        {loads
          .map((ref) => new LoadModel(ref))
          .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
          .map((load) => (
            <Job
              key={load.id}
              name={load.humanizeFiles}
              message={statusMessage(load)}
              status={load.status}
              progress={load.progress}
              details={
                load.errors.length ? <ErrorLines error={load.errors} /> : null
              }
              onCancel={() => cancelLoad(load)}
            />
          ))}
      </div>
    </section>
  )
}

function statusMessage(load) {
  switch (load.status) {
    case "aborted":
      return `Aborted ${fmt.formatDistanceToNow(load.abortedAt)} ago`
    case "loading":
      return `Started ${fmt.formatDistanceToNow(load.startedAt)} ago`
    case "error":
      return `Finished ${fmt.formatDistanceToNow(load.finishedAt)} ago with ${
        load.errors.length
      } errors.`
    case "success":
      return `Successfully finished loading ${fmt.formatDistanceToNow(
        load.finishedAt
      )} ago. `
  }
}
