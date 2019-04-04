/* @flow */

import type {Thunk} from "redux-thunk"

import type {Descriptor, Tuple} from "../types"
import {fetchByMd5, fetchTuplesByUid} from "./correlations"
import {getRightSidebarIsOpen} from "../reducers/view"
import Log from "../models/Log"

export const viewLogDetail = (log: Log): Thunk => (dispatch, getState) => {
  if (getRightSidebarIsOpen(getState())) {
    dispatch(pushLogDetail(log))
    dispatch(fetchTuplesByUid(log))
    dispatch(fetchByMd5(log))
  }
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
