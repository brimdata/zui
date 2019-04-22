/* @flow */

import {remote} from "electron"

export function getAppName() {
  return remote.app.getName()
}
