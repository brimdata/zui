/* @flow */

import {fetchDescriptor} from "./descriptors"
import {getDescriptors} from "../reducers/descriptors"
import {setCurrentSpaceName} from "../actions"
import MockBoomClient from "../../test/MockBoomClient"
import initTestStore from "../../test/initTestStore"

test("#fetchDescriptor", (done) => {
  const boom = new MockBoomClient()
  const store = initTestStore(boom)

  boom.stubSend("descriptors.get", [{name: "hello", type: "world"}])

  store.dispatch(setCurrentSpaceName("default"))

  store.dispatch(fetchDescriptor("1")).then(() => {
    expect(getDescriptors(store.getState())).toEqual({
      "default.1": [{name: "hello", type: "world"}]
    })
    done()
  })
})
