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
    min_time: {
      sec: 1425564900,
      ns: 0
    },
    max_time: {
      sec: 1428917793,
      ns: 750000000
    },
    pcap_support: true,
    ingest: {progress: null, warnings: []}
  }
}

export default function(name: string) {
  if (name in fixtures) {
    return fixtures[name]
  } else {
    throw new Error("Unknown fixture: " + name)
  }
}
