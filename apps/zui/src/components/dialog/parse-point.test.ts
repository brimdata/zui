import {parsePoint} from "./parse-point"

test("left top", () => {
  expect(parsePoint("left top")).toEqual(["left", "top"])
})

test("center left", () => {
  expect(parsePoint("center left")).toEqual(["left", "center"])
})

test("center right", () => {
  expect(parsePoint("center right")).toEqual(["right", "center"])
})

test("right bottom", () => {
  expect(parsePoint("right bottom")).toEqual(["right", "bottom"])
})

test("bottom center", () => {
  expect(parsePoint("bottom center")).toEqual(["center", "bottom"])
})

test("10% 20%", () => {
  expect(parsePoint("10% 20%")).toEqual(["10%", "20%"])
})
