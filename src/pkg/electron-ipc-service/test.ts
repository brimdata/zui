import {createClient, serve} from "./index"

class Paths {
  getPath(name: string) {
    return "/hello/world/" + name
  }
}

const paths = new Paths()
const pathsClient = createClient(Paths)
serve(paths)

test("the main instance", () => {
  expect(paths.getPath("user")).toBe("/hello/world/user")
})

test("the renderer client", async () => {
  expect(await pathsClient.getPath("user")).toEqual("/hello/world/user")
})
