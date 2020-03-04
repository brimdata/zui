/* @flow */

export type TextIterator = AsyncGenerator<string, void, void>

export default async function* textIterator(
  stream: ReadableStream
): TextIterator {
  let reader = stream.getReader()
  let text = new TextDecoder()
  try {
    while (true) {
      let {done, value} = await reader.read()
      if (!done && value) {
        yield text.decode(value)
      } else {
        return
      }
    }
  } finally {
    reader.releaseLock()
  }
}
