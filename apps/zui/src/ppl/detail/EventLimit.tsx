import {Caption} from "src/app/detail/Shared"
import React, {memo, useCallback} from "react"
import {useDispatch} from "src/app/core/state"
import Link from "src/js/components/common/Link"
import {openNewSearchTab} from "src/js/flows/openNewSearchWindow"
import submitSearch from "src/app/query-home/flows/submit-search"
import Editor from "src/js/state/Editor"

type Props = {
  count: number
  query: string
  limit: number
}

export default memo<Props>(function EventLimit({query, count, limit}) {
  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    dispatch(Editor.setValue(query))
    if (global.windowName === "detail") {
      dispatch(openNewSearchTab())
    } else {
      dispatch(submitSearch())
    }
  }, [query])

  if (count < limit) return null
  return (
    <Caption>
      Limited to {limit} events.
      <Link onClick={onClick}>Query for All</Link>
    </Caption>
  )
})
