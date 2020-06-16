/* @flow */

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

  await logStep("wait for pcap file input", () =>
    app.client.waitForVisible(selectors.ingest.filesButton)
  )
  await logStep("choose file", () =>
    app.client.chooseFile(
      selectors.ingest.filesInput,
      path.normalize(path.join(testDataDir(), file))
    )
  )

  try {
    await logStep("wait for ingest to start", () =>
      retryUntil(
        () => app.client.isExisting(selectors.status.ingestProgress),
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

  await logStep("wait for ingest to finish", () =>
    retryUntil(
      () => app.client.isExisting(selectors.status.ingestProgress),
      (ingesting) => ingesting === false
    )
  )
}
