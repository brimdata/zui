import * as MenuStyler from "./MenuStyler"

describe("#ensureVisible", () => {
  beforeAll(() => {
    // @ts-ignore
    window.innerWidth = 600
    // @ts-ignore
    window.innerHeight = 400
    window.dispatchEvent(new Event("resize"))
  })

  const bounds = {height: 100, width: 100}

  test("aligned left and within bounds", () => {
    const style = {top: 0, left: 0}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({top: 0, left: 0})
  })

  test("aligned left overflow width", () => {
    const style = {top: 0, left: 501}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({top: 0, left: 401})
  })

  test("aligned left overflow height", () => {
    const style = {top: 450, left: 0}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({top: 350, left: 0})
  })

  test("aligned left overflow height and width", () => {
    const style = {top: 301, left: 501}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({
      top: 201,
      left: 401
    })
  })

  test("aligned right and within bounds", () => {
    const style = {right: 0, top: 0}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({
      top: 0,
      right: 0
    })
  })

  test("alighed right overflow width", () => {
    const style = {right: 501, top: 0}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({
      top: 0,
      right: 401
    })
  })

  test("aligned right overflow height", () => {
    const style = {right: 0, top: 401}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({
      right: 0,
      top: 301
    })
  })

  test("aligned right overflow height and width", () => {
    const style = {right: 501, top: 301}
    expect(MenuStyler.ensureVisible(bounds, style)).toEqual({
      right: 401,
      top: 201
    })
  })
})
