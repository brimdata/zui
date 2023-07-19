export function pipeText(
  stream: ReadableStream<Uint8Array> | null | NodeJS.ReadableStream
): AsyncGenerator<string, void> {
  if (!stream) return noop();
  if ('getReader' in stream) {
    return browserPipeText(stream as ReadableStream<Uint8Array>);
  } else {
    return nodePipeText(stream as NodeJS.ReadableStream);
  }
}

// eslint-disable-next-line
async function* noop() {}

async function* browserPipeText(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const text = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (!done && value) {
        yield text.decode(value);
      } else {
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function nodePipeText(
  stream: NodeJS.ReadableStream
): AsyncGenerator<string, void> {
  const resolves: ((value: IteratorResult<string, void>) => void)[] = [];
  const pending: IteratorResult<string, void>[] = [];

  stream.on('data', (data) => {
    const value = { done: false, value: data.toString() };
    if (resolves.length) {
      const res = resolves.shift();
      if (res) res(value);
    } else {
      pending.push(value);
    }
  });

  stream.on('end', () => {
    const value = { done: true, value: null as never };
    if (resolves.length) {
      const res = resolves.shift();
      if (res) res(value);
    } else {
      pending.push(value);
    }
  });

  return {
    return() {
      return Promise.resolve({ done: true, value: null as never });
    },
    throw(e) {
      return Promise.reject(e);
    },
    next() {
      const result = pending.shift();
      if (result) {
        return Promise.resolve(result);
      } else {
        return new Promise((res) => {
          resolves.push(res);
        });
      }
    },
    [Symbol.asyncIterator]: function () {
      return this;
    },
  };
}
