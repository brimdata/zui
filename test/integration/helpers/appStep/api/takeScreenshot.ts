import {writeFileSync} from "fs-extra"

import {Application} from "spectron"
import crypto from "crypto"
import path from "path"

import {LOG} from "../../log"
import {itestDir} from "../../env"

export default async (app: Application) => {
  try {
    const currentWin = app.client.getCurrentWindow()
    const image = await currentWin.capturePage()
    const filePath = path.join(
      itestDir(),
      "failure-" + crypto.randomBytes(4).toString("hex") + ".png"
    )
    writeFileSync(filePath, image)
    LOG.info(`wrote out screen shot to "${filePath}"`)
  } catch (e) {
    LOG.error("unable to take screen shot: " + e)
  }
}
