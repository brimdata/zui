/* @flow */
export default {
  spaces: {
    create: () => Promise.resolve({name: "dataSpace"}),
    list: () => Promise.resolve(["dataSpace"]),
    get: () =>
      Promise.resolve({
        name: "dataSpace",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
        packet_support: true
      })
  },
  pcaps: {
    post: function*() {
      yield {type: "TaskStart"}
      yield {
        type: "PacketPostStatus",
        start_time: {sec: 0, ns: 0},
        update_time: {sec: 1, ns: 1},
        packet_total_size: 100,
        packet_read_size: 1
      }
      yield {type: "TaskEnd"}
    }
  }
}
