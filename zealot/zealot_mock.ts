// @ts-nocheck

import { createZealot } from "./zealot.ts";
import { FetchArgs } from "./fetcher/fetcher.ts";
import { createStream } from "./fetcher/stream.ts";

function fakeFetcher() {
  return {
    promise: ({ method, path }) => {
      throw new Error(`NoNetwork: You must stub: ${method} ${path}`);
    },
    stream: ({ method, path }) => {
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
  const cancel = () => {};
  const resp = {};
  return createStream(iterator(), cancel, resp);
}

export function createZealotMock() {
  const mock = createZealot("unit.test", { fetcher: fakeFetcher });
  const calls = [];

  function stub(method, output, wrapper) {
    const [resource, action] = method.split(".");
    const fn = (input) => {
      calls.push({ method, args: input });
      return wrapper(output);
    };
    if (action) {
      mock[resource][action] = fn;
    } else {
      mock[resource] = fn;
    }
    return mock;
  }

  mock.stubStream = (method, output) => stub(method, output, stream);
  mock.stubPromise = (method, output) => stub(method, output, promise);
  mock.calls = (method) => calls.filter((c) => c.method === method);

  return mock;
}
