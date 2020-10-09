import {getWindowDimens} from "./dimens"

const screens = [
  {x: 0, y: 23, width: 1680, height: 1027},
  {x: -80, y: -1057, width: 1920, height: 1057}
]

const defaults = {
  x: undefined,
  y: undefined,
  width: 1250,
  height: 750
}

const get = (saved) => getWindowDimens(saved, defaults, screens)

test("valid", () => {
  const input = {x: 33, y: 44, width: 200, height: 100}
  const output = {x: 33, y: 44, width: 200, height: 100}

  expect(get(input)).toEqual(output)
})

test("super wide", () => {
  const input = {x: 33, y: 44, width: 4000, height: 100}
  const output = {x: 33, y: 44, width: 1680, height: 100}

  expect(get(input)).toEqual(output)
})

test("super tall", () => {
  const input = {x: 33, y: 44, width: 200, height: 2000}
  const output = {x: 33, y: 44, width: 200, height: 1027}

  expect(get(input)).toEqual(output)
})

test("off screen", () => {
  const input = {x: 2000, y: 0, width: 200, height: 2000}
  const output = defaults

  expect(get(input)).toEqual(output)
})
