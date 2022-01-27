import {Lake} from "../../../src/js/state/Lakes/types"
import {PoolState} from "../../../src/js/state/Pools/types"

const pool1 = (): PoolState => ({
  data: {
    id: "1",
    name: "default",
    layout: {
      order: "asc",
      keys: [["ts"]]
    }
  },
  stats: {
    size: 99,
    span: {
      ts: new Date(1425564900 * 1000),
      dur: 1428917793 * 1000 + 7500
    }
  }
})

const workspace1 = (): Lake => ({
  id: "test:9867",
  name: "testName1",
  host: "test",
  port: "9867",
  authType: "none"
})

const workspace2 = (): Lake => ({
  id: "test:9868",
  name: "testName2",
  host: "test",
  port: "9868",
  authType: "none"
})

const fixtures = () => ({
  workspace1: workspace1(),
  workspace2: workspace2(),
  pool1: pool1()
})

export default function(name: string) {
  const f = fixtures()
  if (name in f) {
    return f[name]
  } else {
    throw new Error("Unknown fixture: " + name)
  }
}
