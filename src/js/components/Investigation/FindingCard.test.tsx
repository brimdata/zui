import React from "react"

import FindingCard from "./FindingCard"
import brim from "../../brim"
import loginTo from "../../test/helpers/loginTo"
import provide from "../../test/helpers/provide"
import {Finding} from "src/js/state/Investigation/types"

let store
beforeEach(async () => {
  const setup = await loginTo("cluster1", "space1")
  store = setup.store
})

function getActionTypes() {
  return store.getActions().map((a) => a.type)
}

const finding: Finding = {
  ts: brim.time().toTs(),
  search: {
    program: "finding card test",
    pins: [],
    spanArgs: [brim.time().toTs(), brim.time().toTs()],
    spaceId: "1",
    spaceName: "space1",
    target: "events"
  }
}

test("Clicking the history submits the search", () => {
  const el = provide(
    store,
    <FindingCard spaceId="1" connId="1" finding={finding} />
  )
  store.clearActions()
  el.simulate("click")
  expect(getActionTypes()).toContain("SEARCH_BAR_SUBMIT")
})
