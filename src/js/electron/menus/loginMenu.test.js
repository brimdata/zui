/* @flow */
import {createLoginMenuTemplate} from "./loginMenu"

let send

beforeEach(() => {
  send = jest.fn()
})

test("login menu", () => {
  let template = createLoginMenuTemplate(send)

  expect(template).toMatchSnapshot()
})
