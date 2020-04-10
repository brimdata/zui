/* @flow */

import path from "path"

import lib from "./"

const testFile = (name) => path.join(__dirname, "../../../itest/", name)
const pcap = testFile("sample.pcap")
const pcapng = testFile("sample.pcapng")
const zeek = testFile("sample.tsv")
const json = testFile("sample.ndjson")

test("a pcap file", async () => {
  expect(await lib.fileType(pcap)).toBe("pcap")
})

test("a pcapng file", async () => {
  expect(await lib.fileType(pcapng)).toBe("pcap")
})

test("a zeek file", async () => {
  expect(await lib.fileType(zeek)).toBe("zeek")
})

test("new line json", async () => {
  expect(await lib.fileType(json)).toBe("zeek")
})
