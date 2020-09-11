import {Application} from "spectron"

import logStep from "../util/logStep"
import waitForResults from "../util//waitForResults"
import {selectors} from "../../../../src/js/test/integration"

export const runSearch = async (app: Application, searchText: string) => {
  // Run a search and wait for results to appear. Do not return results.
  // This is suitable for setting up the app to do something else
  // after receiving results, like a context menu test.
  await logStep("write to main search", () =>
    app.client
      .waitForVisible(selectors.search.input)
      .then(() => app.client.setValue(selectors.search.input, searchText))
  )
  await logStep("click the search button", () => app.client.keys("Enter"))
  return waitForResults(app)
}

export const getResults = async (
  app: Application,
  includeHeaders = true
): Promise<string[]> => {
  // Return search current search results. This is useful for getting
  // the current results by doing a search through other means, like a
  // context menu-built search.

  const searchDisplayHeaders = async (app: Application): Promise<string[]> => {
    // This stinks. We have to use getHTML because headers that are off the
    // screen return as empty strings if you use getText. This isn't required of
    // actual results.
    // See http://v4.webdriver.io/api/property/getText.html
    // app.browserWindow.maximize() fixes the problem on my laptop but not CI.
    // But what we get back includes the width which can be non-deterministic:
    // <div class="header-cell" style="width: 192px;">ts<div class="col-resizer"></div></div>
    // That style width will vary on my laptop vs. CI.
    // The hack is to split this and extract just the text.
    const _trim = (s: string) => s.split(">")[1].split("<")[0]

    let headers = await logStep("get search headers", () =>
      app.client
        .waitForVisible(selectors.viewer.headers)
        .then(() => app.client.getHTML(selectors.viewer.headers))
    )
    if (typeof headers === "string") {
      headers = [headers]
    }
    return headers.map((h) => _trim(h))
  }

  const searchResults = await logStep("get search records", async () => {
    await app.client.waitForVisible(selectors.viewer.results)
    return app.client.getText(selectors.viewer.results)
  })

  let headers
  if (
    includeHeaders &&
    (await app.client.isVisible(selectors.viewer.headers))
  ) {
    headers = await searchDisplayHeaders(app)
  } else {
    headers = []
  }
  return headers.concat(searchResults)
}

export default async (app: Application, searchText: string) => {
  // Run a search and return results.
  await runSearch(app, searchText)
  return getResults(app)
}
