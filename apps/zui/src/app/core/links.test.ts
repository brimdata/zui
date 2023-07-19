import links from "./links"
import fetch from "node-fetch"
import AbortController from "abort-controller"

const fetchStatusCode = async (link: string): Promise<[string, number]> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 1000)

  try {
    const resp = await fetch(link, {signal: controller.signal})
    return [link, resp.status]
  } catch (err) {
    throw `fetch failed when trying to test link => ${link} (${err})`
  } finally {
    clearTimeout(timeout)
  }
}

test("no broken links", async () => {
  const statusCodes = await Promise.all<[string, number]>(
    Object.values(links).map(fetchStatusCode)
  )
  statusCodes.forEach(([link, code]) => {
    try {
      expect(code).toBe(200)
    } catch {
      throw `Broken link => ${link}: ${code}`
    }
  })
})
