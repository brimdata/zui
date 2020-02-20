/* @flow */

export default {
  open(file: string, lastOpened: number = new Date().getTime()) {
    return {type: "RECENT_FILES_OPEN", file, lastOpened}
  },
  remove(file: string) {
    return {type: "RECENT_FILES_REMOVE", file}
  }
}
