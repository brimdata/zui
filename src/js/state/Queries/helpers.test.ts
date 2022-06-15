/**
 * @jest-environment jsdom
 */

import {getNextQueryCount} from "./helpers"
import {Query} from "./types"

const excludeTestQueries: Query[] = [
  {
    id: "1",
    name: "Exclude me please",
  },
  {
    id: "2",
    name: "query #1",
  },
  {
    id: "3",
    name: "Query#1",
  },
  {
    id: "4",
    name: "Query #1s1",
  },
  {
    id: "5",
    name: "Query #1 ",
  },
]

const includeTestQueries: Query[] = [
  {
    id: "6",
    name: "Query #1",
  },
  {
    id: "7",
    name: "Query #3",
  },
  {
    id: "8",
    name: "Query #2",
  },
]

test("getNextQueryCount", () => {
  expect(getNextQueryCount([])).toEqual(1)
  expect(getNextQueryCount(excludeTestQueries)).toEqual(1)
  expect(
    getNextQueryCount([...excludeTestQueries, ...includeTestQueries])
  ).toEqual(4)
  expect(
    getNextQueryCount([
      {id: "9", name: "Query #10"},
      ...excludeTestQueries,
      ...includeTestQueries,
    ])
  ).toEqual(11)
})
