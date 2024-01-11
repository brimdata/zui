export function getInput(input) {
  if (typeof input === 'string') return input;
  if (input instanceof File) return input.stream();
  if (input instanceof Blob) return input.stream();
  if (input instanceof ReadableStream) return input;
  if (input instanceof Response) return input.body;
  if (Array.isArray(input)) return arrayStream(input);
  if (input === undefined) return undefined;
  if (input === null) return undefined;
  throw new Error(`Unsupported input type provided to zq ${input}`);
}

function arrayStream(input) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(ctl) {
      for (const item of input) {
        ctl.enqueue(encoder.encode(JSON.stringify(item) + '\n'));
      }
      ctl.close();
    },
  });
}
