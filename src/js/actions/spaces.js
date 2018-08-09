import * as outMessages from "../treehouse/outMessages"

export function fetchSpaceInfo(name) {
  return (dispatch, getState, api) => {
    api.send(outMessages.fetchSpaceInfo(name)).done(space => {
      dispatch(setSpaceInfo(space))
    })
  }
}

export const fetchAllSpaces = () => (dispatch, _getState, api) => {
  dispatch(requestAllSpaces())
  api.send(outMessages.fetchSpaces()).done(spaces => {
    if (!spaces.error) spaces.forEach(name => dispatch(fetchSpaceInfo(name)))
  })
}

export const requestAllSpaces = () => {
  return {
    type: "ALL_SPACES_REQUEST"
  }
}

export function setSpaceInfo(spaceInfo) {
  return {
    type: "SPACE_INFO_SET",
    spaceInfo
  }
}

export function requestSpaceInfo(name) {
  return {
    type: "SPACE_INFO_REQUEST",
    name
  }
}

export function setCurrentSpaceName(name) {
  return {
    type: "CURRENT_SPACE_NAME_SET",
    name
  }
}
