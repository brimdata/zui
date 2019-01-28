/* @flow */

import initStore from "../test/initStore"
import {addNotification, removeNotification} from "../actions/notifications"
import {getNotifications} from "../selectors/notifications"

let store
beforeEach(() => {
  store = initStore()
})

test("Initial state is empty array", () => {
  expect(getNotifications(store.getState())).toEqual([])
})

test("Add a notification", () => {
  const notification = {
    type: "BroError",
    data: {broVersion: "1.2.3"},
    key: "1"
  }

  store.dispatch(addNotification(notification))

  const state = store.getState()
  expect(getNotifications(state)).toEqual([
    {
      type: "BroError",
      data: {broVersion: "1.2.3"},
      key: "1"
    }
  ])
})

test("Remove a notification", () => {
  const state = store.dispatchAll([
    addNotification({type: "A", data: {message: "123"}, key: "1"}),
    addNotification({type: "B", data: {dna: true}, key: "2"}),
    addNotification({type: "C", data: {age: 44}, key: "3"}),
    removeNotification(1)
  ])

  expect(getNotifications(state)).toEqual([
    {type: "A", data: {message: "123"}, key: "1"},
    {type: "C", data: {age: 44}, key: "3"}
  ])
})
