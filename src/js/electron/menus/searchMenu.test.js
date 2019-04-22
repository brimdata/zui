/* @flow */
import {createSearchMenuTemplate} from "./searchMenu"

let send

beforeEach(() => {
  send = jest.fn()
})

test("search menu", () => {
  let template = createSearchMenuTemplate(send)

  expect(template).toMatchSnapshot()
})
