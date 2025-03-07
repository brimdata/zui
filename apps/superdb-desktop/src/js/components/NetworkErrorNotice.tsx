import {useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"

import {ErrorData} from "../errors/types"
import Notice from "../state/Notice"
import Current from "../state/Current"
import LakeStatuses from "../state/LakeStatuses"
import {checkStatus} from "../flows/lake/checkStatus"
import {useDispatch} from "src/core/use-dispatch"

type Props = {
  error: ErrorData
}

const BACKOFF = [16, 32, 64]
const MAX_BACKOFF = 128

export default function NetworkErrorNotice({error}: Props) {
  const dispatch = useDispatch()
  const lakeId = useSelector(Current.getLakeId)
  const status = useSelector(LakeStatuses.get(lakeId))
  const [count, setCount] = useState(0)
  const statusRef = useRef(status)
  const wsRef = useRef(lakeId)

  const retry = () => {
    setCount(0)
    dispatch(checkStatus())
  }
  const dismiss = () => {
    dispatch(Notice.dismiss())
  }

  useEffect(() => {
    if (lakeId === wsRef.current) {
      statusRef.current = status
      if (status === "disconnected") dismiss()
    }
  }, [status, lakeId])

  useEffect(() => {
    wsRef.current = lakeId
    dispatch(LakeStatuses.set(lakeId, "retrying"))

    let id = null
    let attempt = 0

    function tick() {
      setCount((count) => {
        if (count === 0) return BACKOFF[attempt] || MAX_BACKOFF
        if (count === 1) {
          dispatch(checkStatus())
          attempt++
          return 0
        }
        return count - 1
      })
      id = setTimeout(tick, 1000)
    }
    tick()

    return () => {
      clearTimeout(id)
      if (statusRef.current === "retrying") {
        dispatch(LakeStatuses.set(wsRef.current, "disconnected"))
      }
    }
  }, [])

  if (count === 0) {
    return <p>Attempting to connect...</p>
  } else {
    return (
      <p>
        {error.message} Retrying in {count} seconds.
        <a onClick={retry}>Retry Now</a>
        <a onClick={dismiss}>Dismiss</a>
      </p>
    )
  }
}
