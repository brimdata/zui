/* @flow */

import type {Space} from "../lib/Space"

export function setSpaceInfo(spaceInfo: $Shape<Space>) {
  return {
    type: "SPACE_INFO_SET",
    spaceInfo
  }
}

export function setCurrentSpaceName(name: string) {
  return {
    type: "CURRENT_SPACE_NAME_SET",
    name
  }
}

export function setSpaceNames(names: string[]) {
  return {
    type: "SPACE_NAMES_SET",
    names
  }
}

export function clearSpaces() {
  return {
    type: "SPACES_CLEAR"
  }
}
