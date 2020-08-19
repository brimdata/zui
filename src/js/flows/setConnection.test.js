/* @flow */

import fixtures from "../test/fixtures"
import {createZealotMock} from "zealot"
import initTestStore from "../test/initTestStore"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import Notice from "../state/Notice"
import {setConnection} from "./setConnection"

let store, zealot
const select = (selector) => selector(store.getState())
// $FlowFixMe
const clusterCount = () => select(Clusters.all).length
const conn1 = fixtures("cluster1")
const conn2 = fixtures("cluster2")

beforeEach(() => {
  zealot = createZealotMock()
    .stubPromise("status", "ok")
    .stubPromise("spaces.list", [])
  store = initTestStore(zealot)
  store.dispatchAll([Clusters.add(conn1), Current.setConnectionId(conn1.id)])
})

test("Create a new connection, switch back", async () => {
  expect(clusterCount()).toBe(1)
  await store.dispatch(setConnection(conn2))
  expect(clusterCount()).toBe(2)
  expect(select(Clusters.id(conn2.id))).toEqual(conn2)
  expect(select(Current.getConnectionId)).toBe(conn2.id)

  await store.dispatch(setConnection(conn1))
  expect(clusterCount()).toBe(2)
  expect(select(Clusters.id(conn1.id))).toEqual(conn1)
  expect(select(Current.getConnectionId)).toBe(conn1.id)
})

test("Error set when no connection", async () => {
  zealot.stubPromise("status", Promise.reject("Connection refused"))

  expect(select(Notice.getError)).toBe(null)
  expect(clusterCount()).toBe(1)
  await store.dispatch(
    setConnection({
      id: "broken",
      host: "h",
      port: "p",
      password: "p",
      username: "u"
    })
  )
  expect(clusterCount()).toBe(1)

  const err = select(Notice.getError)
  expect(err).not.toBe(null)
  // $FlowFixMe
  expect(/Cannot connect to /i.test(err)).toBe(true)
})
