import {positionTooltip, xPosition} from "./XPositionTooltip"
import * as d3 from "d3"

describe("#xPosition", () => {
  let parentWidth, padding, width
  beforeEach(() => {
    parentWidth = 1000
    padding = 20
    width = 100
  })

  test("right of the mouse", () => {
    expect(xPosition(0, width, parentWidth, padding)).toBe("20px")
    expect(xPosition(879, width, parentWidth, padding)).toBe("899px")
  })

  test("left of the mouse", () => {
    expect(xPosition(880, width, parentWidth, padding)).toBe("760px")
    expect(xPosition(1000, width, parentWidth, padding)).toBe("880px")
  })
})

describe("#positionTooltip", () => {
  let tooltip, parent
  beforeAll(() => {
    tooltip = document.createElement("div")
    parent = document.createElement("div")
    d3.mouse = jest.fn(() => [0, 0])
  })

  test("adds style to tooltip", () => {
    positionTooltip(tooltip, parent, 20)
    expect(tooltip.style.left).toMatch(/\d+px/)
    expect(tooltip.style.opacity).toBe("1")
  })
})
