/* @flow */
import type {Cluster} from "../../state/Clusters/types"
import type {Space} from "../../state/Spaces/types"

const space1 = (): Space => ({
  id: "1",
  name: "default",
  storage_kind: "filestore",
  min_time: {
    sec: 1425564900,
    ns: 0
  },
  max_time: {
    sec: 1428917793,
    ns: 750000000
  },
  pcap_support: true,
  ingest: {progress: null, warnings: [], snapshot: null}
})

const cluster1 = (): Cluster => ({
  id: "test:9867",
  host: "test",
  port: "9867",
  username: "",
  password: ""
})

const cluster2 = (): Cluster => ({
  id: "test:9868",
  host: "test",
  port: "9868",
  username: "",
  password: ""
})

let fixtures = () => ({
  cluster1: cluster1(),
  cluster2: cluster2(),
  space1: space1()
})

export default function(name: string) {
  const f = fixtures()
  if (name in f) {
    return f[name]
  } else {
    throw new Error("Unknown fixture: " + name)
  }
}
