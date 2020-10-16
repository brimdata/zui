import {center, dimensFromSizePosition, getWindowDimens, stack} from "./dimens"

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

test("all undefined", () => {
  const input = {
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined
  }
  const screens = [{x: 0, y: 23, width: 1920, height: 1057}]
  const result = getWindowDimens(input, defaults, screens)
  expect(result).toEqual(defaults)
})

test("conversion", () => {
  const size = [300, 600] as [number, number]
  const position = [10, 20] as [number, number]
  expect(dimensFromSizePosition(size, position)).toEqual({
    x: 10,
    y: 20,
    width: 300,
    height: 600
  })
})

test("conversion when position gone", () => {
  const size = [300, 600] as [number, number]
  const position = undefined
  expect(dimensFromSizePosition(size, position)).toEqual({
    x: undefined,
    y: undefined,
    width: 300,
    height: 600
  })
})

test("center easy case", () => {
  const outer = {x: 0, y: 0, width: 700, height: 500}
  const inner = {x: 0, y: 0, width: 200, height: 100}

  const centered = center(inner, outer)

  expect(centered).toEqual({
    x: 250,
    y: 200,
    width: 200,
    height: 100
  })
})

test("center when inner much bigger", () => {
  const outer = {x: 0, y: 0, width: 700, height: 500}
  const inner = {x: 0, y: 0, width: 900, height: 800}

  const centered = center(inner, outer)

  expect(centered).toEqual({
    y: 0,
    x: 0,
    width: 700,
    height: 500
  })
})

test("center when negative x y", () => {
  const outer = {x: -1000, y: -1000, width: 700, height: 500}
  const inner = {x: -999, y: -999, width: 200, height: 100}

  const centered = center(inner, outer)

  expect(centered).toEqual({
    x: -750,
    y: -800,
    width: 200,
    height: 100
  })
})

test("center when positive x y", () => {
  const outer = {x: 1000, y: 1000, width: 700, height: 500}
  const inner = {x: 1001, y: 1001, width: 200, height: 100}

  const centered = center(inner, outer)

  expect(centered).toEqual({
    x: 1250,
    y: 1200,
    width: 200,
    height: 100
  })
})

test("center only producers integers", () => {
  const outer = {x: 1000, y: 1000, width: 701, height: 501}
  const inner = {x: 1001, y: 1001, width: 200, height: 100}

  const centered = center(inner, outer)

  expect(centered).toEqual({
    x: 1250,
    y: 1200,
    width: 200,
    height: 100
  })
})

test("stack easy", () => {
  const prev = {x: 0, y: 0, width: 400, height: 300}
  const screen = {x: 0, y: 0, width: 1000, height: 800}

  const stacked = stack(prev, screen, 25)

  expect(stacked).toEqual({
    x: 25,
    y: 25,
    width: 400,
    height: 300
  })
})

test("stack when x will go over", () => {
  const prev = {x: 600, y: 100, width: 400, height: 300}
  const screen = {x: 0, y: 0, width: 1000, height: 800}

  const stacked = stack(prev, screen, 25)

  expect(stacked).toEqual({
    x: 25,
    y: 125,
    width: 400,
    height: 300
  })
})

test("stack when y will go over", () => {
  const prev = {x: 500, y: 500, width: 400, height: 300}
  const bounds = {x: 0, y: 0, width: 1000, height: 800}

  const stacked = stack(prev, bounds, 25)

  expect(stacked).toEqual({
    x: 525,
    y: 25,
    width: 400,
    height: 300
  })
})

test("when both will go over", () => {
  const prev = {x: 600, y: 500, width: 400, height: 300}
  const bounds = {x: 0, y: 0, width: 1000, height: 800}

  const stacked = stack(prev, bounds, 25)

  expect(stacked).toEqual({
    x: 25,
    y: 25,
    width: 400,
    height: 300
  })
})

test("when window is bigger than screen", () => {
  const prev = {x: 600, y: 500, width: 6000, height: 5000}
  const bounds = {x: 0, y: 0, width: 1000, height: 800}

  const stacked = stack(prev, bounds, 25)

  expect(stacked).toEqual({
    x: 0,
    y: 0,
    width: 1000,
    height: 800
  })
})
