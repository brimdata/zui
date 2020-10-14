import {Application} from "spectron"
import path from "path"

import {testDataDir} from "../../env"
import {click} from "./click"
import logStep from "../util/logStep"
import {selectors} from "../../../../src/js/test/integration"
import {popNoticeLocator} from "../../../../src/js/test/locators"

export default async (app: Application, file: string) => {
  // Ingest a file inside the itest/testdata directory
  await click(app, ".add-tab")

  await logStep("wait for pcap file input", async () =>
    (await app.client.$(selectors.ingest.filesButton)).waitForDisplayed()
  )

  await logStep("choose file", async () => {
    const fileInput = await app.client.$(selectors.ingest.filesInput)
    const remoteFile = await app.client.uploadFile(
      path.normalize(path.join(testDataDir(), file))
    )
    await fileInput.addValue(remoteFile)
  })

  const notice = await app.client.$(popNoticeLocator.css)
  app.client.waitUntil(() =>
    notice.getText().then((text) => text === "Import complete.")
  )
}
