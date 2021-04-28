export default {
  spaces: {
    create: () => Promise.resolve({name: "dataSpace"}),
    list: () => Promise.resolve(["dataSpace"]),
    get: () =>
      Promise.resolve({
        name: "dataSpace",
        min_time: {ns: 0, sec: 0},
        max_time: {ns: 1, sec: 1}
      })
  }
}
