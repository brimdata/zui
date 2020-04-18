/* @flow */

import path from "path"

export default (name: string) => {
  return path.join(__dirname, "../../../itest", name)
}
