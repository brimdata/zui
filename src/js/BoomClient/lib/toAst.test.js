import toAst from "./toAst"

test("parsing with a bare sort proc", () => {
  expect(toAst("192.168.0.51 _path=http | count() by method | sort"))
})
