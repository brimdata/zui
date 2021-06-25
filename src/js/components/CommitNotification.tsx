import {useDispatch, useSelector} from "react-redux"
import Search from "../state/Search"
import {submitSearch} from "../flows/submitSearch/mod"
import InfoNotice from "./InfoNotice"
import XButton from "./XButton"
import React, {useEffect, useState} from "react"
import Current from "../state/Current"
import {useHistory} from "react-router"
import {SpanArgs} from "../state/Search/types"
import {decodeSearchParams} from "../../../app/search/utils/search-params"

export default function CommitNotification() {
  const dispatch = useDispatch()
  const pool = useSelector(Current.mustGetPool)
  const size = pool.size
  const fullSpan = JSON.stringify(pool.everythingSpan())
  const history = useHistory()
  const nowIngesting = pool.ingesting()
  const [prevSize, setPrevSize] = useState(size)
  const [prevFullSpan, setPrevFullSpan] = useState(fullSpan)
  const [isStale, setIsStale] = useState(false)
  const [newSpan, setNewSpan] = useState<SpanArgs>(pool.everythingSpan())

  useEffect(() => {
    setPrevSize(size)
    setPrevFullSpan(fullSpan)
    if (!nowIngesting) {
      const {spanArgs: currentSpan} = decodeSearchParams(
        history.location.search
      )
      if (size !== prevSize) {
        setIsStale(true)

        const [from, to] = currentSpan
        const [newFrom, newTo] = JSON.parse(fullSpan)

        if (!from || !to || JSON.stringify(currentSpan) === prevFullSpan) {
          setNewSpan([newFrom, newTo])
          return
        }

        // default to new span boundary if one of the search spans is not set
        setNewSpan([from || newFrom, to || newTo])
      } else {
        setIsStale(false)
      }
    }
  }, [fullSpan, size])

  const onClick = (choice) => {
    setIsStale(false)
    if (choice === 0) {
      dispatch(Search.setSpanArgs(newSpan))
      dispatch(submitSearch())
    }
  }

  if (!isStale) return null

  return (
    <InfoNotice>
      <p>More data is now available.</p>
      <p>
        <button className="bevel-button" onClick={() => onClick(0)}>
          Refresh
        </button>
      </p>
      <XButton onClick={() => onClick(1)} />
    </InfoNotice>
  )
}
