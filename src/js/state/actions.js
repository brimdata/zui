/* @flow */

export function setCurrentSpaceName(space: string) {
  return {
    type: "SEARCH_SPACE_SET",
    space
  }
}
