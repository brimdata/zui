/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import type {BrimError} from "../errors/types"
import {initSpace} from "../flows/initSpace"
import Notice from "../state/Notice"
import Tab from "../state/Tab"

type Props = {
  error: BrimError
}

const BACKOFF = [16, 32, 64]
const MAX_BACKOFF = 128

export default function NetworkErrorNotice({error}: Props) {
  let dispatch = useDispatch()
  let space = useSelector(Tab.getSpaceName)
  let [count, setCount] = useState(0)

  const retry = () => dispatch(initSpace(space))
  const dismiss = () => dispatch(Notice.dismiss())

  useEffect(() => {
    let id = null
    let attempt = 0

    function tick() {
      setCount((count) => {
        if (count === 0) return BACKOFF[attempt] || MAX_BACKOFF
        if (count === 1) {
          retry()
          attempt++
          return 0
        }
        return count - 1
      })
      id = setTimeout(tick, 1000)
    }
    tick()

    return () => clearTimeout(id)
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
