export default {
  pools: {
    create: () => Promise.resolve({name: "dataPool"}),
    list: () => Promise.resolve(["dataPool"]),
    get: () =>
      Promise.resolve({
        name: "dataPool",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1},
      }),
  },
}
