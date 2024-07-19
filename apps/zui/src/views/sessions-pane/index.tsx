import {QuerySession} from "src/models/query-session"

export function SessionsPane() {
  const sessions = QuerySession.useAll()
  console.log(sessions[0])
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
