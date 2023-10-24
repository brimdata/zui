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

async function* nodePipeText(stream: NodeJS.ReadableStream) {
  for await (const chunk of stream) {
    yield chunk.toString();
  }
}
