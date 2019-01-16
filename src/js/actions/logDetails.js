/* @flow */

import {fetchTuplesByUid} from "./tuplesByUid"
import type {Tuple, Descriptor} from "../models/Log"
import Log from "../models/Log"
import type {Thunk} from "redux-thunk"

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
