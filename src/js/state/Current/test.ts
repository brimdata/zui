/**
 * @jest-environment jsdom
 */

import tabHistory from "src/app/router/tab-history"
import initTestStore from "src/test/unit/helpers/initTestStore"
import Lakes from "../Lakes"
import {Lake} from "../Lakes/types"
import Current from "./"
import {lakePath} from "src/app/router/utils/paths"
import {Store} from "../types"
import dispatchAll from "src/test/unit/helpers/dispatchAll"

let store: Store

beforeEach(async () => {
  store = await initTestStore()
})

test("setting the lake id", () => {
  store.dispatch(tabHistory.push(lakePath("a")))

  expect(Current.getLakeId(store.getState())).toBe("a")
})

test("getting the actual lake", () => {
  const l: Lake = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none",
  }
  const state = dispatchAll(store, [Lakes.add(l)])
  store.dispatch(tabHistory.push(lakePath(l.id)))

  expect(Current.mustGetLake(state).serialize()).toEqual(l)
})
