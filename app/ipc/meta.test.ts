import {meta} from "./meta"

test("repo", () => {
  expect(meta.repo()).toMatch(/^\w+\/\w+$/)
})

test("packageJSON", () => {
  expect(meta.packageJSON()).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      repository: expect.any(String),
      version: expect.any(String)
    })
  )
})
