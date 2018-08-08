import {ReadableStream} from "web-streams-polyfill"
import jsonStream from "./jsonStream"

test("chunk with complete json", async () => {
  const chunks = [JSON.stringify({id: 1})]
  const stream = jsonStream(mockReader(chunks))
  const reader = stream.getReader()

  let {value, done} = await reader.read()
  expect(value).toEqual({id: 1})
  expect(done).toBe(false)

  let result = await reader.read()
  expect(result.done).toBe(true)
})

test("three chunks with one line of json", () => {
  const json = {id: 1, name: "james"}
  const chunks = partition(JSON.stringify(json), 3)
  const stream = jsonStream(mockReader(chunks))
  const reader = stream.getReader()

  return reader.read().then(({value, done}) => {
    expect(value).toEqual(json)
    expect(done).toBe(false)
  })
})

test("two lines split into 5 chunks", async () => {
  const line1 = {id: 1, name: "james"}
  const line2 = {id: 2, name: "matt"}
  const chunks = partition([line1, line2].map(JSON.stringify).join("\n\n\n"), 5)
  const stream = jsonStream(mockReader(chunks))
  const reader = stream.getReader()
  let result

  result = await reader.read()
  expect(result.value).toEqual(line1)

  result = await reader.read()
  expect(result.value).toEqual(line2)
})

test("when it is split on the new line", async () => {
  const line1 = {id: 1, name: "james"}
  const line2 = {id: 2, name: "matt"}
  const chunks = partition([line1, line2].map(JSON.stringify).join("\n\n\n"), 2)
  const stream = jsonStream(mockReader(chunks))
  const reader = stream.getReader()
  let result

  result = await reader.read()
  expect(result.value).toEqual(line1)

  result = await reader.read()
  expect(result.value).toEqual(line2)
})

test("4 lines in the same chunk", async () => {
  const line1 = {id: 1, name: "james"}
  const line2 = {id: 2, name: "matt"}
  const line3 = {id: 3, name: "steve"}
  const line4 = {id: 4, name: "rosie"}
  const chunks = [
    [line1, line2, line3, line4].map(JSON.stringify).join("\n\n\n")
  ]
  const stream = jsonStream(mockReader(chunks))
  const reader = stream.getReader()
  let result

  result = await reader.read()
  expect(result.value).toEqual(line1)

  result = await reader.read()
  expect(result.value).toEqual(line2)

  result = await reader.read()
  expect(result.value).toEqual(line3)

  result = await reader.read()
  expect(result.value).toEqual(line4)

  result = await reader.read()
  expect(result.done)
})

const mockReader = (chunks = []) =>
  new ReadableStream({
    start(controller) {
      chunks.forEach(chunk => controller.enqueue(chunk))
      controller.close()
    }
  }).getReader()

const partition = (string, numChunks) => {
  const chunkLength = Math.floor(string.length / numChunks)
  let chunks = []

  for (let num = 0; num < numChunks; num += 1) {
    const start = num * chunkLength
    if (num == numChunks - 1) {
      chunks.push(string.substring(start))
    } else {
      chunks.push(string.substring(start, start + chunkLength))
    }
  }

  return chunks
}
