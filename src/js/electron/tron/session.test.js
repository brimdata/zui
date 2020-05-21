/* @flow */
import fsExtra from "fs-extra"

import formatSessionState from "./formatSessionState"
import initTestStore from "../../test/initTestStore"
import tron from "./"

beforeEach(() => fsExtra.ensureDir("tmp"))
afterEach(() => fsExtra.remove("tmp"))

test("session loading with migrations", async () => {
  let state = initTestStore().getState()
  let migrations = await tron.migrations()
  let session = tron.session("tmp/appState.json")
  let data = formatSessionState({}, state)
  await session.save(data)

  await session.load()
  expect(session.getVersion()).toEqual(migrations.getLatestVersion())
})
