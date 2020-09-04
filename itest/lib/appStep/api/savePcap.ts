

import { Application } from "spectron";

import { retryUntil } from "../../control";
import { waitForClickableButtonAndClick } from "./click";
import logStep from "../util/logStep";
import { selectors } from "../../../../src/js/test/integration";

export default (async (app: Application) => {
  await waitForClickableButtonAndClick(app, selectors.pcaps.button);
  return logStep("wait for a download to finish", async () => {
    await app.client.waitForVisible(selectors.downloadMessage);
    return retryUntil(() => app.client.getText(selectors.downloadMessage), text => text == "Download Complete" || text.includes("Download error"));
  });
});

export const pcapsDir = (app: Application) => app.electron.remote.app.getPath("temp");