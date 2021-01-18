import fixtures from "../test/fixtures"
import {createZealotMock} from "zealot"
import initTestStore from "../test/initTestStore"
import Workspaces from "../state/Workspaces"
import Current from "../state/Current"
import {initWorkspace} from "./initWorkspace"

let store, mock
const select = (selector) => selector(store.getState())

const clusterCount = () => select(Workspaces.all).length
const conn1 = fixtures("workspace1")
const conn2 = fixtures("cluster2")

beforeEach(() => {
  mock = createZealotMock()
    .stubPromise("version", "1")
    .stubPromise("spaces.list", [])
    .stubPromise("version", "1")
    .stubPromise("spaces.list", [])
  store = initTestStore(mock.zealot)
  store.dispatchAll([Workspaces.add(conn1), Current.setWorkspaceId(conn1.id)])
})

test("Create a new workspace, switch back", async () => {
  expect(clusterCount()).toBe(1)
  await store.dispatch(initWorkspace(conn2))
  expect(clusterCount()).toBe(2)
  expect(select(Workspaces.id(conn2.id))).toEqual(conn2)
  expect(select(Current.getWorkspaceId)).toBe(conn2.id)

  await store.dispatch(initWorkspace(conn1))
  expect(clusterCount()).toBe(2)
  expect(select(Workspaces.id(conn1.id))).toEqual(conn1)
  expect(select(Current.getWorkspaceId)).toBe(conn1.id)
})
