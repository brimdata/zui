/* @flow */

import {conn, dns} from "../test/mockLogs"
import {getLogCorrelations} from "./correlations"
import {pushLogDetail} from "../state/actions/logDetails"
import {receiveDescriptor} from "../state/actions/descriptors"
import {setCorrelation} from "../state/actions/correlations"
import {setCurrentSpaceName} from "../state/actions/spaces"
import Log from "../models/Log"
import initTestStore from "../test/initTestStore"

describe("#getLogCorrelations", () => {
  const space = "default"
  const dnsLog = dns()
  const connLog = conn()
  const md5Result = {
    descriptor: [{name: "md5", type: "string"}, {name: "count", type: "count"}],
    tuples: [["asdfasdfasf", "200"]]
  }

  let store, state

  beforeEach(() => {
    store = initTestStore()
    state = store.dispatchAll([
      receiveDescriptor(space, connLog.get("_td"), connLog.descriptor),
      receiveDescriptor(space, dnsLog.get("_td"), dnsLog.descriptor),
      setCurrentSpaceName(space),
      pushLogDetail(connLog),

      setCorrelation(connLog.id(), "uid", [dnsLog.tuple, connLog.tuple]),
      setCorrelation(connLog.id(), "md5", md5Result)
    ])
  })

  test("uid correlations", () => {
    expect(getLogCorrelations(state)).toHaveProperty("uid", [connLog, dnsLog])
  })

  test("md5 correlations", () => {
    expect(getLogCorrelations(state)).toHaveProperty(
      "md5",
      Log.build(md5Result)
    )
  })
})
