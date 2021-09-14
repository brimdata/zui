import {last} from "lodash"
import loginTo from "test/unit/helpers/loginTo"
import {createRecord} from "test/shared/factories/zed-factory"
import {useResponse} from "test/shared/responses"
import {fetchCorrelation} from "./fetch"

const zeek = createRecord({
  _path: "dns",
  uid: "CbOjYpkXn9LfqV51c",
  duration: null,
  ts: new Date(0)
})

const suricata = createRecord({
  ts: new Date(0),
  community_id: "1:N7YGmWjwTmMKNhsZHBR618n3ReA="
})

const stubs = {
  uidResult: useResponse("correlationUid"),
  uidAndCommunityResult: useResponse("correlationUidCommunityId"),
  alertResults: useResponse("onlyAlerts"),
  noCommunityIdInConn: useResponse("noCommunityIdInConn")
}

describe("zeek log when community_id is found", () => {
  let setup
  beforeEach(async () => {
    setup = await loginTo("workspace1", "pool1")
    setup.zealot.stubStream("query", stubs.uidResult)
    setup.zealot.stubStream("query", stubs.uidAndCommunityResult)
  })

  test("runs two queries ", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("query").length
    await store.dispatch(fetchCorrelation(zeek))
    expect(zealot.calls("query")).toHaveLength(before + 2)
  })

  test("executes uid first, then cid", async () => {
    const {store, zealot} = setup
    await store.dispatch(fetchCorrelation(zeek))
    const searches = zealot.calls("query")
    const len = searches.length
    expect(searches[len - 2].args).toMatchInlineSnapshot(
      `"from '1' | ts >= 2015-03-05T14:15:00Z | ts <= 2015-04-13T09:36:33.751Z | uid==\\"CbOjYpkXn9LfqV51c\\" or \\"CbOjYpkXn9LfqV51c\\" in conn_uids or \\"CbOjYpkXn9LfqV51c\\" in uids or referenced_file.uid==\\"CbOjYpkXn9LfqV51c\\" | head 100"`
    )
    expect(searches[len - 1].args).toMatchInlineSnapshot(
      `"from '1' | ts >= 2015-03-05T14:15:00Z | ts <= 2015-04-13T09:36:33.751Z | uid==\\"CbOjYpkXn9LfqV51c\\" or \\"CbOjYpkXn9LfqV51c\\" in conn_uids or \\"CbOjYpkXn9LfqV51c\\" in uids or referenced_file.uid==\\"CbOjYpkXn9LfqV51c\\" or (community_id == \\"1:N7YGmWjwTmMKNhsZHBR618n3ReA=\\" and ts >= 1582646593.978 and ts < 1582646683.994) | head 100"`
    )
  })

  test("returns the records", async () => {
    const {store} = setup
    const records = await store.dispatch(fetchCorrelation(zeek))
    expect(records.length).toBe(2)
  })
})

describe("zeek log when community_id is not found", () => {
  let setup
  beforeEach(async () => {
    setup = await loginTo("workspace1", "pool1")
    setup.zealot.stubStream("query", stubs.noCommunityIdInConn)
  })

  test("executes only 1 query", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("query").length
    await store.dispatch(fetchCorrelation(zeek))
    expect(zealot.calls("query")).toHaveLength(before + 1)
  })

  test("runs the uid search", async () => {
    const {zealot, store} = setup
    await store.dispatch(fetchCorrelation(zeek))
    expect(last<any>(zealot.calls("query")).args).toMatchInlineSnapshot(
      `"from '1' | ts >= 2015-03-05T14:15:00Z | ts <= 2015-04-13T09:36:33.751Z | uid==\\"CbOjYpkXn9LfqV51c\\" or \\"CbOjYpkXn9LfqV51c\\" in conn_uids or \\"CbOjYpkXn9LfqV51c\\" in uids or referenced_file.uid==\\"CbOjYpkXn9LfqV51c\\" | head 100"`
    )
  })

  test("returns the records", async () => {
    const {store} = setup
    const records = await store.dispatch(fetchCorrelation(zeek))
    expect(records.length).toBe(2)
  })
})

describe("suricata alert when community_id found", () => {
  let setup

  beforeEach(async () => {
    setup = await loginTo("workspace1", "pool1")
    setup.zealot.stubStream("query", stubs.alertResults)
  })

  test("issues only one search", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("query").length
    await store.dispatch(fetchCorrelation(suricata))
    expect(zealot.calls("query")).toHaveLength(before + 1)
  })

  test("issues the community id query", async () => {
    const {zealot, store} = setup
    await store.dispatch(fetchCorrelation(suricata))
    expect(last<any>(zealot.calls("query")).args).toMatchInlineSnapshot(
      `"from '1' | ts >= 2015-03-05T14:15:00Z | ts <= 2015-04-13T09:36:33.751Z | community_id==\\"1:N7YGmWjwTmMKNhsZHBR618n3ReA=\\" | head 100"`
    )
  })

  test("returns the records", async () => {
    const {store} = setup
    const records = await store.dispatch(fetchCorrelation(suricata))
    expect(records.length).toBe(11)
  })
})
