import {Session} from "src/models/session"

export function SessionsPane() {
  const sessions = Session.useAll()

  return (
    <ul className="gutter-block">
      {sessions.map((session) => {
        return <li key={session.id}>{session.id}</li>
      })}
    </ul>
  )
}
