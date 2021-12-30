/**
 * @jest-environment jsdom
 */

import {lakePath} from "app/router/utils/paths"
import React from "react"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import {createRecord} from "test/shared/factories/zed-factory"
import fixtures from "test/unit/fixtures"
import {fireEvent, flushPromises, render, screen} from "test/unit/helpers"
import {setupBrim} from "test/unit/helpers/setup-brim"
import LogDetailsWindow from "./index"

const workspace = fixtures("workspace1")
const pool = fixtures("pool1")
const record = createRecord({ts: new Date(0), name: "Alice", age: 99})
const brim = setupBrim({page: "detail", workspace, pool})

beforeEach(async () => {
  brim.dispatch(viewLogDetail(record))
  brim.navTo(lakePath(pool.id, workspace.id))
})

test("right click => new search focuses search window", async () => {
  const {store, main} = brim
  render(<LogDetailsWindow />, {store})

  fireEvent.contextMenu(screen.getByText("Alice"))
  fireEvent.click(screen.getByText(/new search with this value/i))
  await flushPromises()

  const searchWindow = main.windows.getAll().find((w) => w.name === "search")
  expect(searchWindow.ref.focus).toHaveBeenCalled()
})
