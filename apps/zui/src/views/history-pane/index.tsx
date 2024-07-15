import {Snapshot} from "src/models/snapshot"

export function HistoryPane() {
  const snapshots = Snapshot.useAll()

  return (
    <article className="box">
      <h1>History</h1>
      <ul>
        {snapshots.map((snapshot) => {
          return <li key={snapshot.id}>{snapshot.queryText}</li>
        })}
      </ul>
    </article>
  )
}
