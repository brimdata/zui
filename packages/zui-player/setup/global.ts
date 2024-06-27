import "regenerator-runtime/runtime"

import {remove, mkdirp} from "fs-extra"
import {itestDir} from "../helpers/env"

module.exports = async () => {
  process.env.BRIM_ITEST = "true"
  await remove(itestDir())
  await mkdirp(itestDir())
}
