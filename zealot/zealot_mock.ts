import { createZealot } from "./zealot.ts";
import { FetchArgs } from "./fetcher/fetcher.ts";
import { createStream } from "./fetcher/stream.ts";
import { Payload } from "./types.ts";

function fakeFetcher() {
  return {
    promise: ({ method, path }: FetchArgs) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`);
    },
    stream: ({ method, path }: FetchArgs) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`);
    },
  };
}

function promise(response: any) {
  return Promise.resolve(response);
}

function stream(response: Payload[]) {
  async function* iterator() {
    if (response) {
      for (const payload of response) yield payload;
    }
  }

  return Promise.resolve(createStream(iterator(), {} as Response));
}

export function createZealotMock() {
  const mock = createZealot("unit.test", { fetcher: fakeFetcher });
  const calls: any[] = [];

  function stub(
    method: string,
    output: any,
    wrapper: typeof stream | typeof promise,
  ) {
    const [resource, action] = method.split(".");
    const fn = (input: any) => {
      calls.push({ method, args: input });
      return wrapper(output);
    };
    if (action) {
      // @ts-ignore
      mock[resource][action] = fn;
    } else {
      // @ts-ignore
      mock[resource] = fn;
    }
    return mock;
  }

  // @ts-ignore
  mock.stubStream = (method: string, output: any) =>
    stub(method, output, stream);
  // @ts-ignore
  mock.stubPromise = (method: string, output: any) =>
    stub(method, output, promise);
  // @ts-ignore
  mock.calls = (method: string) => calls.filter((c) => c.method === method);

  return mock;
}
