/* @flow */

import Client from "boom-js-client"
import type {Space} from "../lib/Space"

export function fetchSpaceInfo(name: string) {
  return (dispatch: *, getState: *, api: Client) => {
    api.space({name}).done(space => {
      dispatch(setSpaceInfo(space))
    })
  }
}

export const fetchAllSpaces = () => (
  dispatch: *,
  _getState: *,
  api: Client
) => {
  dispatch(requestAllSpaces())
  api
    .spaces()
    .done(spaces => {
      spaces.forEach(name => dispatch(fetchSpaceInfo(name)))
    })
    .error(e => console.log(e))
}

export const requestAllSpaces = () => {
  return {
    type: "ALL_SPACES_REQUEST"
  }
}

export function setSpaceInfo(spaceInfo: Space) {
  return {
    type: "SPACE_INFO_SET",
    spaceInfo
  }
}

export function requestSpaceInfo(name: string) {
  return {
    type: "SPACE_INFO_REQUEST",
    name
  }
}

export function setCurrentSpaceName(name: string) {
  return {
    type: "CURRENT_SPACE_NAME_SET",
    name
  }
}

export function unselectSpace() {
  return {
    type: "SPACE_UNSELECT"
  }
}
