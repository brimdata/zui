/* @flow */
import errors from "./"

test("pcapIngestError", () => {
  let err = "fatal error on backend"

  expect(errors.pcapIngest(err)).toEqual({
    type: "PCAPIngestError",
    message: "Unable to generate full summary logs from PCAP",
    details: ["Detail: fatal error on backend"]
  })
})

test("pcapIngestError (sort limit)", () => {
  let err = "sort limit reached"

  expect(errors.pcapIngest(err)).toEqual({
    type: "PCAPIngestError",
    message: "Unable to generate full summary logs from PCAP",
    details: [
      "Detail: sort limit reached",
      "This PCAP contains too much network traffic to load into Brim."
    ]
  })
})
