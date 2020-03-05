/* @flow */

const NEW_LINE = "\n\n\n"

export type JsonPipeIterator = AsyncGenerator<Object, *, *>

export default async function* jsonPipeIterator(
  iterator: AsyncIterator<string>
): JsonPipeIterator {
  let leftover = ""

  for await (let value of iterator) {
    let start = 0
    let end = 0
    let chunk = (leftover += value)

    while ((end = chunk.indexOf(NEW_LINE, start)) !== -1) {
      let line = chunk.substring(start, end)
      yield JSON.parse(line)
      start = end + NEW_LINE.length
    }
    leftover = chunk.substring(start)
  }
  if (leftover) yield JSON.parse(leftover)
}
