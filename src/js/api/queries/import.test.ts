/**
 * @jest-environment jsdom
 */

import Queries from "src/js/state/Queries"
import {Group} from "src/js/state/Queries/types"
import initTestStore from "src/test/unit/helpers/initTestStore"
import {getPath} from "zui-test-data"
import {queriesImport} from "./import"

const store = initTestStore()

test("import queries function", () => {
  const path = getPath("brimcap-queries.json")
  store.dispatch(queriesImport({path} as File))
  const tree = Queries.raw(store.getState())
  const meta = (tree.items[0] as Group).items[0]
  const query = Queries.build(store.getState(), meta.id)

  expect(query.name).toBe("Activity Overview")
  expect(query.latestVersion().value).toBe("count() by _path | sort -r")
})
