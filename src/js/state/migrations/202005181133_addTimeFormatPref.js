/* @flow */

import {getAllStates} from "../../test/helpers/getTestState"

export default function addTimeFormatPref(state: *) {
  for (let s of getAllStates(state)) {
    s.prefs.timeFormat = ""
  }
  return state
}
