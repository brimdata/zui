/* @flow */
import mergeResults from "./mergeResults"

test("mergeResults from empty", () => {
  let a = {tuples: {}, descriptors: {}}
  let b = {
    descriptors: {
      "10000": [
        {name: "_td", type: "int"},
        {name: "tx_hosts", type: "set[addr]"},
        {name: "count", type: "count"}
      ]
    },
    tuples: {"0": [["10000", "93.184.220.29", "1"]]}
  }

  expect(mergeResults(a, b)).toEqual(b)
})

test("mergeResults with new channel", () => {
  let a = {
    descriptors: {
      "10000": [
        {name: "_td", type: "int"},
        {name: "tx_hosts", type: "set[addr]"},
        {name: "count", type: "count"}
      ]
    },
    tuples: {"0": [["10000", "93.184.220.29", "1"]]}
  }

  let b = {
    descriptors: {
      "10000": [
        {name: "_td", type: "int"},
        {name: "tx_hosts", type: "set[addr]"},
        {name: "count", type: "count"}
      ]
    },
    tuples: {"1": [["10000", "93.184.220.29", "1"]]}
  }

  expect(mergeResults(a, b)).toEqual({
    descriptors: {
      "10000": [
        {name: "_td", type: "int"},
        {name: "tx_hosts", type: "set[addr]"},
        {name: "count", type: "count"}
      ]
    },
    tuples: {
      "1": [["10000", "93.184.220.29", "1"]],
      "0": [["10000", "93.184.220.29", "1"]]
    }
  })
})
