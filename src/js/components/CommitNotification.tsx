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
import {Span} from "../brim"

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

        // if user had not searched at all, searched using the empty pool span
        // default, or had searched using the previous pool's full span, then
        // we will load up the 'refresh' button's search with the new full span
        if (
          isEmptySpan(currentSpan) ||
          JSON.stringify(currentSpan) === prevFullSpan
        ) {
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

const isEmptySpan = (span: Partial<SpanArgs>) => {
  if (!span || span.length !== 2) return true
  const [from, to] = span as Span
  if (!from || !to) return true
  return from.sec === 0 && from.ns === 0 && to.sec === 0 && to.ns === 1000000
}
