export function pipeText(
  stream: ReadableStream<Uint8Array> | null | NodeJS.ReadableStream
): AsyncGenerator<string, void> {
  if (!stream) return noop()
  // @ts-ignore
  if (stream.getReader) {
    return browserPipeText(stream as ReadableStream<Uint8Array>)
  } else {
    return nodePipeText(stream as NodeJS.ReadableStream)
  }
}

async function* noop() {}

async function* browserPipeText(stream: ReadableStream<Uint8Array>) {
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

function nodePipeText(
  stream: NodeJS.ReadableStream
): AsyncGenerator<string, void> {
  let resolves: ((value: IteratorResult<string, void>) => void)[] = []
  let pending: IteratorResult<string, void>[] = []

  stream.on("data", (data) => {
    let value = {done: false, value: data.toString()}
    if (resolves.length) {
      resolves.shift()!(value)
    } else {
      pending.push(value)
    }
  })

  stream.on("end", () => {
    const value = {done: true, value: null as never}
    if (resolves.length) {
      resolves.shift()!(value)
    } else {
      pending.push(value)
    }
  })

  return {
    return() {
      return Promise.resolve({done: true, value: null as never})
    },
    throw(e) {
      return Promise.reject(e)
    },
    next() {
      const result = pending.shift()
      if (result) {
        return Promise.resolve(result)
      } else {
        return new Promise((res) => {
          resolves.push(res)
        })
      }
    },
    [Symbol.asyncIterator]: function () {
      return this
    },
  }
}
