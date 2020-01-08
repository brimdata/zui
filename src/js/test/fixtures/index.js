/* @flow */
let fixtures = {
  cluster1: {
    id: "cluster1",
    host: "test",
    port: "9867",
    username: "",
    password: ""
  },
  space1: {
    name: "default",
    compression: "none",
    flush_timeout: 500,
    close_timeout: 5000,
    slab_threshold: 131072,
    slab_fanout: 8,
    max_writers: 150,
    min_time: {
      sec: 1425564900,
      ns: 0
    },
    max_time: {
      sec: 1428917793,
      ns: 750000000
    },
    size: 4580591172,
    packet_support: true
  }
}

export default function(name: string) {
  if (name in fixtures) {
    return fixtures[name]
  } else {
    throw new Error("Unknown fixture: " + name)
  }
}
