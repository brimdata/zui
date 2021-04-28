import {Workspace} from "../../state/Workspaces/types"
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
  ingest: {progress: null, warnings: [], snapshot: null}
})

const workspace1 = (): Workspace => ({
  id: "test:9867",
  name: "testName1",
  host: "test",
  port: "9867",
  authType: "none"
})

const workspace2 = (): Workspace => ({
  id: "test:9868",
  name: "testName2",
  host: "test",
  port: "9868",
  authType: "none"
})

const fixtures = () => ({
  workspace1: workspace1(),
  workspace2: workspace2(),
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
