/**
 * @jest-environment jsdom
 */

import {derivePoolName} from "./getParams"

const fakeFile = (path: string, name: string): File => {
  const f = new File([], name)
  f.path = path
  return f
}

test("one pcap default", () => {
  const name = derivePoolName(
    [{type: "pcap", file: fakeFile("/work/my.pcap", "my.pcap")}],
    []
  )
  expect(name).toEqual("my.pcap")
})

test("two zeek logs in same dir default", () => {
  const name = derivePoolName(
    [
      {type: "log", file: fakeFile("/work/zeek-1.log", "zeek-1.log")},
      {type: "log", file: fakeFile("/work/zeek-2.log", "zeek-2.log")},
    ],
    []
  )

  expect(name).toEqual("work")
})
