/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {initSpace} from "../flows/initSpace"
import AppError from "../models/AppError"
import Notice from "../state/Notice"
import Tab from "../state/Tab"

type Props = {
  error: AppError
}

export default function NetworkErrorNotice({error}: Props) {
  let dispatch = useDispatch()
  let space = useSelector(Tab.spaceName)

  const retry = () => dispatch(initSpace(space))
  const dismiss = () => dispatch(Notice.dismiss())

  return (
    <p>
      {error.message()}
      <a onClick={retry}>Retry</a>
      <a onClick={dismiss}>Dismiss</a>
    </p>
  )
}
