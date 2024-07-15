/**
 * @jest-environment jsdom
 */

import initTestStore from "src/test/unit/helpers/initTestStore"
import {Session} from "./session"
import {BrowserTab} from "./browser-tab"

beforeEach(() => initTestStore())

test("new tab", () => {
  expect(BrowserTab.count).toBe(1)
  expect(Session.count).toBe(0)
  Session.createWithTab()
  expect(BrowserTab.count).toBe(2)
  expect(Session.count).toBe(1)
})
