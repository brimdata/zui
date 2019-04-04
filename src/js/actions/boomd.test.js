/* @flow */

import {LookytalkVersionError} from "../models/Errors"
import {checkLookytalkVersion} from "./boomd"
import MockBoomClient from "../test/MockBoomClient"
import initTestStore from "../test/initTestStore"

test("#checkLookytalkVersion when they are the same", done => {
  const boom = new MockBoomClient()
  const {lookytalk} = boom.clientVersion()
  boom.stubSend("serverVersion", {lookytalk})

  const store = initTestStore(boom)

  store.dispatch(checkLookytalkVersion()).then(() => {
    expect(store.getActions()).toEqual([])
    done()
  })
})

test("#checkLookytalkVersion when they are different", done => {
  const boom = new MockBoomClient().stubSend("serverVersion", {
    lookytalk: "1.1.1"
  })
  const store = initTestStore(boom)

  store.dispatch(checkLookytalkVersion()).then(() => {
    const action = store.getActions()[0]
    expect(action.type).toBe("NOTIFICATIONS_ADD")
    expect(action.notification).toBeInstanceOf(LookytalkVersionError)
    done()
  })
})
