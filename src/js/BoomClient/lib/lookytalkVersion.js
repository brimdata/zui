/* @flow */

import packageJSON from "../../../../package.json"

export default () => {
  return packageJSON.dependencies.lookytalk.split("#")[1]
}
