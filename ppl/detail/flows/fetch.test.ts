import {last} from "lodash"
import loginTo from "src/js/test/helpers/loginTo"
import {createRecord} from "test/factories/zed-factory"
import {useResponse} from "test/responses"
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

const uidOrCommunityIdZql =
  'uid="CbOjYpkXn9LfqV51c" or "CbOjYpkXn9LfqV51c" in conn_uids or "CbOjYpkXn9LfqV51c" in uids or referenced_file.uid="CbOjYpkXn9LfqV51c" or (community_id = "1:N7YGmWjwTmMKNhsZHBR618n3ReA=" and ts >= 1582646593.978 and ts < 1582646683.994) | head 100'

const uidZql =
  'uid="CbOjYpkXn9LfqV51c" or "CbOjYpkXn9LfqV51c" in conn_uids or "CbOjYpkXn9LfqV51c" in uids or referenced_file.uid="CbOjYpkXn9LfqV51c" | head 100'

const cidZql = 'community_id="1:N7YGmWjwTmMKNhsZHBR618n3ReA=" | head 100'

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
    setup.zealot.stubStream("search", stubs.uidResult)
    setup.zealot.stubStream("search", stubs.uidAndCommunityResult)
  })

  test("runs two queries ", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("search").length
    await store.dispatch(fetchCorrelation(zeek))
    expect(zealot.calls("search")).toHaveLength(before + 2)
  })

  test("executes uid first, then cid", async () => {
    const {store, zealot} = setup
    await store.dispatch(fetchCorrelation(zeek))
    const searches = zealot.calls("search")
    const len = searches.length
    expect(searches[len - 2].args).toBe(uidZql)
    expect(searches[len - 1].args).toBe(uidOrCommunityIdZql)
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
    setup.zealot.stubStream("search", stubs.noCommunityIdInConn)
  })

  test("executes only 1 query", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("search").length
    await store.dispatch(fetchCorrelation(zeek))
    expect(zealot.calls("search")).toHaveLength(before + 1)
  })

  test("runs the uid search", async () => {
    const {zealot, store} = setup
    await store.dispatch(fetchCorrelation(zeek))
    expect(last<any>(zealot.calls("search")).args).toBe(uidZql)
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
    setup.zealot.stubStream("search", stubs.alertResults)
  })

  test("issues only one search", async () => {
    const {zealot, store} = setup
    const before = zealot.calls("search").length
    await store.dispatch(fetchCorrelation(suricata))
    expect(zealot.calls("search")).toHaveLength(before + 1)
  })

  test("issues the community id query", async () => {
    const {zealot, store} = setup
    await store.dispatch(fetchCorrelation(suricata))
    expect(last<any>(zealot.calls("search")).args).toBe(cidZql)
  })

  test("returns the records", async () => {
    const {store} = setup
    const records = await store.dispatch(fetchCorrelation(suricata))
    expect(records.length).toBe(11)
  })
})
