import React, {memo} from "react"
import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import {SessionPage} from "."

const MemoSessionPage = memo(SessionPage)

export function SessionRoute() {
  const location = useSelector(Current.getLocation)

  return <MemoSessionPage locationKey={location.key} />
}
