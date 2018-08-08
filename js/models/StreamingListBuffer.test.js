import StreamingListBuffer from "./StreamingListBuffer"

test("can be given and ID", () => {
  const buffer = new StreamingListBuffer("SUPER_BUFF")

  expect(buffer.getList()).toEqual([])
})

test("append", () => {
  const buffer = new StreamingListBuffer("SUPER_BUFF")

  buffer.append([1, 2, 3])

  expect(buffer.getList()).toEqual([1, 2, 3])
})

test("clear", () => {
  const buffer = new StreamingListBuffer("SUPER_BUFF")

  buffer.append([1, 2, 3])
  buffer.clear()

  expect(buffer.getList()).toEqual([])
})
