import links from "./links"
import nodeFetch from "node-fetch"

const fetchStatusCode = async (link: string): Promise<[string, number]> => {
  const resp = await nodeFetch(link)
  return [link, resp.status]
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
