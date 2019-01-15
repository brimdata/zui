/* @flow */

import {getCurrentSpaceName} from "../reducers/spaces"
import uniq from "lodash/uniq"
import type {Thunk} from "redux-thunk"
import type {Tuple, Descriptor} from "../models/Log"

export const discoverDescriptors = (events: Tuple[] = []): Thunk => {
  return (dispatch, getState) => {
    const state = getState()
    const schemas = state.descriptors
    const space = state.currentSpaceName
    const unknownSchemas = uniq(
      events
        .map(([descriptorId]) => descriptorId)
        .filter(id => !schemas[space + "." + id])
    )
    unknownSchemas.forEach(id => dispatch(fetchDescriptor(id)))
  }
}

export const fetchDescriptor = (id: string): Thunk => {
  return (dispatch, getState, api) => {
    const space = getCurrentSpaceName(getState())

    dispatch(requestDescriptor(space, id))
    return api
      .descriptor({space, id})
      .done(descriptor => {
        dispatch(receiveDescriptor(space, id, descriptor))
      })
      .error(error => dispatch(errorDescriptor(error)))
  }
}

export const requestDescriptor = (space: string, id: string) => ({
  type: "DESCRIPTOR_REQUEST",
  space,
  id
})

export const receiveDescriptor = (
  space: string,
  id: string,
  descriptor: Descriptor
) => ({
  type: "DESCRIPTOR_RECEIVE",
  space,
  id,
  descriptor
})

export const errorDescriptor = (error: string) => ({
  type: "DESCRIPTOR_ERROR",
  error
})

export const clearDescriptors = () => ({
  type: "DESCRIPTORS_CLEAR"
})
