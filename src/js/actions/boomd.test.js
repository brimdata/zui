/* @flow */

import initStore from "../test/initStore"
import {checkLookytalkVersion} from "./boomd"
import {LookytalkVersionError} from "../models/Errors"
import MockApi from "../test/MockApi"

test("#checkLookytalkVersion when they are the same", done => {
  const api = new MockApi()
  const {lookytalk} = api.info()
  api.stub("serverInfo", {lookytalk})
  const store = initStore(api)

  store.dispatch(checkLookytalkVersion()).done(() => {
    expect(store.getActions()).toEqual([])
    done()
  })
})

test("#checkLookytalkVersion when they are different", done => {
  const api = new MockApi().stub("serverInfo", {lookytalk: "1.1.1"})
  const store = initStore(api)

  store.dispatch(checkLookytalkVersion()).done(() => {
    const action = store.getActions()[0]
    expect(action.type).toBe("NOTIFICATIONS_ADD")
    expect(action.notification).toBeInstanceOf(LookytalkVersionError)
    done()
  })
})
