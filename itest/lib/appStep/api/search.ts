import {Application} from "spectron"

import logStep from "../util/logStep"
import waitForResults from "../util//waitForResults"
import {selectors} from "../../../../src/js/test/integration"

export const runSearch = async (app: Application, searchText: string) => {
  // Run a search and wait for results to appear. Do not return results.
  // This is suitable for setting up the app to do something else
  // after receiving results, like a context menu test.
  await logStep("write to main search", async () => {
    const input = await app.client.$(selectors.search.input)
    await input.waitForDisplayed()
    return await input.setValue(searchText)
  })
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

    let headers = await logStep("get search headers", async () => {
      const headers = await app.client.$$(selectors.viewer.headers)
      return await Promise.all(
        headers.map(async (h) => {
          await h.waitForDisplayed()
          return await h.getHTML()
        })
      )
    })

    return headers.map((h) => {
      return _trim(h)
    })
  }

  const searchResults = await logStep("get search records", async () => {
    const results = await app.client.$$(selectors.viewer.results)
    return await Promise.all(
      results.map(async (r) => {
        await r.waitForDisplayed()
        return await r.getText()
      })
    )
  })

  let headers
  if (
    includeHeaders &&
    (await (await app.client.$(selectors.viewer.headers)).isDisplayed())
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
