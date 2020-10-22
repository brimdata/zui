import {Cluster} from "../../state/Clusters/types"
import {Space} from "../../state/Spaces/types"

const space1 = (): Space => ({
  id: "1",
  name: "default",
  storage_kind: "filestore",
  size: 99,
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
  name: "testName1",
  host: "test",
  port: "9867",
  username: "",
  password: "",
  status: "connected"
})

const cluster2 = (): Cluster => ({
  id: "test:9868",
  name: "testName2",
  host: "test",
  port: "9868",
  username: "",
  password: "",
  status: "connected"
})

const fixtures = () => ({
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
