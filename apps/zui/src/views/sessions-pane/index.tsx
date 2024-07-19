import {QuerySession} from "src/models/query-session"

export function SessionsPane() {
  const sessions = QuerySession.useAll()
  return (
    <ul className="gutter-block">
      {sessions.map((session) => {
        return (
          <li key={session.id} onClick={() => session.activate()}>
            {session.id}
          </li>
        )
      })}
    </ul>
  )
}
