import {createClient, serve} from "./index"
import {ipcMain, ipcRenderer} from "electron"

class Paths {
  getPath(name: string) {
    return "/hello/world/" + name
  }
}

const paths = new Paths()
const pathsClient = createClient(Paths)
serve(paths)

test("serve", () => {
  expect(ipcMain.handle).toHaveBeenNthCalledWith(
    1,
    "Paths#getPath",
    expect.any(Function)
  )
})

test("the main instance", () => {
  expect(paths.getPath("user")).toBe("/hello/world/user")
})

test("the renderer client", async () => {
  await pathsClient.getPath("user")
  expect(ipcRenderer.invoke).toHaveBeenCalledWith("Paths#getPath", "user")
})
