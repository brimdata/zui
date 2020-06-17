/* @flow */

import {writeFileSync} from "fs-extra"

import {Application} from "spectron"
import crypto from "crypto"
import path from "path"

import {LOG} from "../../log"
import {itestDir} from "../../env"

export default async (app: Application) => {
  try {
    let image = await app.browserWindow.capturePage()
    let filePath = path.join(
      itestDir(),
      "failure-" + crypto.randomBytes(4).toString("hex") + ".png"
    )
    writeFileSync(filePath, image)
    LOG.info(`wrote out screen shot to "${filePath}"`)
  } catch (e) {
    LOG.error("unable to take screen shot: " + e)
  }
}
