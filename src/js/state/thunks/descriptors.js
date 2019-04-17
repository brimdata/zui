/* @flow */

import type {Thunk} from "redux-thunk"
import uniq from "lodash/uniq"

import type {Tuple} from "../../types"
import {boomFetchDescriptors} from "../../backend/fetch"
import {errorDescriptor, receiveDescriptor, requestDescriptor} from "../actions"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "../reducers/descriptors"

export const discoverDescriptors = (events: Tuple[] = []): Thunk => {
  return (dispatch, getState) => {
    const state = getState()
    const schemas = getDescriptors(state)
    const space = getCurrentSpaceName(state)
    const unknownSchemas = uniq(
      events
        .map(([descriptorId]) => descriptorId)
        .filter((id) => !schemas[space + "." + id])
    )
    unknownSchemas.forEach((id) => dispatch(fetchDescriptor(id)))
  }
}

export const fetchDescriptor = (id: string): Thunk => {
  return (dispatch, getState) => {
    const space = getCurrentSpaceName(getState())

    dispatch(requestDescriptor(space, id))

    return dispatch(boomFetchDescriptors(space, id))
      .then((descriptor) => {
        dispatch(receiveDescriptor(space, id, descriptor))
      })
      .catch((error) => dispatch(errorDescriptor(error)))
  }
}
