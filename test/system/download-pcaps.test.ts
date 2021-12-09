import {screen, waitFor} from "@testing-library/react"
import {app} from "electron"
import {readFileSync} from "fs"
import fsExtra from "fs-extra"
import md5 from "md5"
import path from "path"
import {SystemTest} from "./system-test"
import open from "src/js/lib/open"
import {findByRole} from "@testing-library/dom"

const system = new SystemTest("download-pcaps")

beforeAll(async () => {
  system.mountApp()
  await system.importFile("sample.pcap")
})

test("pcap button downloads deterministically-formed pcap file", async () => {
  await system.runQuery(
    '_path=="ssl" id.orig_h==192.168.1.110 id.resp_h==209.216.230.240 id.resp_p==443'
  )
  system.click(await system.findCell("ssl"))

  await clickPackets()
  await checkFile(
    "packets-2020-02-25T16_03_13.996366Z.pcap",
    "888453c81738fd8ade4c7f9888d86f86"
  )
})

test("pcap download works for null duration", async () => {
  await system.runQuery("duration==null id.orig_p==47783")
  await system.click(await system.findCell("conn"))
  await clickPackets()
  await checkFile(
    "packets-2020-02-25T16_03_09.440467Z.pcap",
    "678442857027fdc5ad1e3418614dcdb8"
  )
})

async function clickPackets() {
  const button = await screen.findByRole("button", {name: "Packets"})
  await waitFor(() => expect(button).not.toBeDisabled())
  screen.getAllByRole("status").map((toast) => toast.remove())
  system.click(button)
  await screen.findByText(/preparation complete/i)
}

jest.mock("../../src/js/lib/open")
async function checkFile(name: string, hash: string) {
  const pcaps = path.join(app.getPath("temp"), name)
  expect(md5(readFileSync(pcaps))).toBe(hash)
  expect(open).toHaveBeenCalledWith(pcaps, {newWindow: true})
  // @ts-ignore
  open.mockReset()
  await fsExtra.remove(pcaps)
}
