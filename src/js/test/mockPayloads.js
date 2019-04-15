/* @flow */

export function histogramPayload() {
  function result() {
    return {
      channel_id: 0,
      type: "SearchResult",
      results: {
        descriptor: [
          {name: "ts", type: "time"},
          {name: "count", type: "count"}
        ],
        tuples: [["9999", "1"], ["9998", "2"]]
      }
    }
  }

  function end() {
    return {
      channel_id: 0,
      type: "SearchEnd"
    }
  }

  return {result, end}
}
