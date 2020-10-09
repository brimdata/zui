import {Application} from "spectron"
import path from "path"

import {testDataDir} from "../../env"
import {retryUntil} from "../../control"
import {click} from "./click"
import logStep from "../util/logStep"
import {LOG} from "../../log"
import {selectors} from "../../../../src/js/test/integration"

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

  try {
    await logStep("wait for ingest to start", () =>
      retryUntil(
        async () =>
          await (
            await app.client.$(selectors.status.ingestProgress)
          ).isExisting(),
        (ingesting) => ingesting === true,
        100,
        100
      )
    )
  } catch {
    LOG.debug(
      "ingest never appeared; let's hope it finished and ended before we could observe it"
    )
  }

  return logStep("wait for ingest to finish", async () => {
    retryUntil(
      async () =>
        await (
          await app.client.$(selectors.status.ingestProgress)
        ).isExisting(),
      (ingesting) => ingesting === false,
      100,
      100
    )
  })
}
