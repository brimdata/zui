/**
 * @jest-environment jsdom
 */

import {getNextCount} from "./helpers"
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

test("getNextCount", () => {
  expect(getNextCount([], "Query")).toEqual(1)
  expect(getNextCount(excludeTestQueries, "Query")).toEqual(1)
  expect(
    getNextCount([...excludeTestQueries, ...includeTestQueries], "Query")
  ).toEqual(4)
  expect(
    getNextCount(
      [
        {id: "9", name: "Query #10"},
        ...excludeTestQueries,
        ...includeTestQueries,
      ],
      "Query"
    )
  ).toEqual(11)
})
