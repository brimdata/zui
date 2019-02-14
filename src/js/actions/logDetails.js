/* @flow */

import type {Thunk} from "redux-thunk"

import type {Descriptor, Tuple} from "../types"
import {fetchTuplesByUid} from "./tuplesByUid"
import Log from "../models/Log"

export const viewLogDetail = (log: Log): Thunk => dispatch => {
  dispatch(pushLogDetail(log))
  dispatch(fetchTuplesByUid(log))
}

export const pushLogDetail = ({
  tuple,
  descriptor
}: {
  tuple: Tuple,
  descriptor: Descriptor
}) => ({
  type: "LOG_DETAIL_PUSH",
  tuple,
  descriptor
})

export const backLogDetail = () => ({
  type: "LOG_DETAIL_BACK"
})

export const forwardLogDetail = () => ({
  type: "LOG_DETAIL_FORWARD"
})
