/* @flow */
import "regenerator-runtime"
import {ztestDir} from "./env"
import {remove} from "fs-extra"

module.exports = async () => {
  global.__ZQD__.stop()
  await remove(ztestDir())
}
