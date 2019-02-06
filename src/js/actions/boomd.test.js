/* @flow */

import initStore from "../test/initStore"
import {checkLookytalkVersion} from "./boomd"
import {LookytalkVersionError} from "../models/Errors"

test("#checkLookytalkVersion when they are the same", () => {
  const store = initStore({
    info: () => ({
      lookytalk: "1.1.1"
    })
  })
  store.dispatch(checkLookytalkVersion("1.1.1"))

  expect(store.getActions()).toEqual([])
})

test("#checkLookytalkVersion when they are different", () => {
  const store = initStore({
    info: () => ({
      lookytalk: "2.2.2"
    })
  })
  store.dispatch(checkLookytalkVersion("1.1.1"))

  const action = store.getActions()[0]

  expect(action.type).toBe("NOTIFICATIONS_ADD")
  expect(action.notification).toBeInstanceOf(LookytalkVersionError)
})
