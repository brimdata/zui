import MockBoomClient from "../test/MockBoomClient"
import {dns} from "../test/mockLogs"
import {fetchTuplesByUid} from "./tuplesByUid"
import initStore from "../test/initStore"

let store, boom
beforeEach(() => {
  boom = new MockBoomClient()
  store = initStore(boom)
})

test("#fetchTuplesByUid", done => {
  boom.stubStream("search")
  const search = jest.spyOn(boom, "search")
  store
    .dispatch(fetchTuplesByUid(dns()))
    .done(() => {
      expect(search).toBeCalledWith(
        "Cum4LVba3W3KNG6qa | head 500",
        expect.any(Object)
      )
      done()
    })
    .error(done)
})
