import links from "./links"
import fetch from "node-fetch"
import AbortController from "abort-controller"

const fetchStatusCode = async (link: string): Promise<[string, number]> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 10_000)

  try {
    const resp = await fetch(link, {signal: controller.signal})
    return [link, resp.status]
  } catch (err) {
    throw `fetch failed when trying to test link => ${link} (${err})`
  } finally {
    clearTimeout(timeout)
  }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test("no broken links", async () => {
  for (const [i, link] of Object.values(links).entries()) {
    if (i > 0) {
      // Sleep to avoid ECONNRESET from fetch.
      await sleep(50)
    }
    const [, code] = await fetchStatusCode(link)
    try {
      expect(code).toBe(200)
    } catch {
      throw `Broken link => ${link}: ${code}`
    }
  }
})
