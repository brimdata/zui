/* @flow */

import * as actions from "./packets"
import {conn} from "../test/mockLogs"
import reducers from "../reducers"
import {setCurrentSpaceName} from "./spaces"

test("fetching packets is a success", done => {
  const state = [setCurrentSpaceName("trump-tower")].reduce(reducers, undefined)
  const log = conn()
  const dispatch = jest.fn()
  const getState = jest.fn(() => state)
  const packetsFn = jest.fn(() => new Promise(res => res("file.pcap")))

  actions
    .fetchPackets(log)(dispatch, getState, {packets: packetsFn})
    .finally(() => {
      expect(packetsFn).toBeCalledWith(
        expect.objectContaining({
          dst_host: "239.255.255.250",
          dst_port: "1900",
          duration_ns: 293000,
          duration_sec: 2,
          proto: "udp",
          space: "trump-tower",
          src_host: "192.168.0.50",
          src_port: "1900",
          ts_ns: 369843000,
          ts_sec: 1425612054
        })
      )

      const dispatched = dispatch.mock.calls.map(([{type}]) => type)
      expect(dispatched).toEqual(
        expect.arrayContaining(["PACKETS_REQUEST", "PACKETS_RECEIVE"])
      )
      expect(dispatched).not.toEqual(expect.arrayContaining(["PACKETS_ERROR"]))
      done()
    })
})

test("fetching packets is a failure", done => {
  const state = [setCurrentSpaceName("trump-tower")].reduce(reducers, undefined)
  const log = conn()
  const dispatch = jest.fn()
  const getState = jest.fn(() => state)
  const packetsFn = jest.fn(() => new Promise((res, rej) => rej()))

  actions
    .fetchPackets(log)(dispatch, getState, {packets: packetsFn})
    .finally(() => {
      expect(packetsFn).toBeCalledWith(
        expect.objectContaining({
          dst_host: "239.255.255.250",
          dst_port: "1900",
          duration_ns: 293000,
          duration_sec: 2,
          proto: "udp",
          space: "trump-tower",
          src_host: "192.168.0.50",
          src_port: "1900",
          ts_ns: 369843000,
          ts_sec: 1425612054
        })
      )

      const dispatched = dispatch.mock.calls.map(([{type}]) => type)
      expect(dispatched).toEqual(
        expect.arrayContaining(["PACKETS_REQUEST", "PACKETS_ERROR"])
      )
      done()
    })
})
