/* @flow */

import packageJSON from "../../../../../package.json"

export default () => {
  return packageJSON.dependencies.zq.split("#")[1]
}
