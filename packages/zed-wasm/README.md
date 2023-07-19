# zed-wasm

The [Zed](https://zed.brimdata.io/) command line tools built for
[WebAssembly](https://webassembly.org/).

[View the interactive demo](https://observablehq.com/d/4064e8ce0f7b7e51)

[Zed](https://zed.brimdata.io/) is a suite of technologies for managing,
storing, and processing data. It's a **superset** of schema-defined **tables**,
and **unstructured documents**; an emerging concept we call
[super-structured data](https://zed.brimdata.io/docs/formats#2-zed-a-super-structured-pattern").

The [storage layer](https://zed.brimdata.io/docs/formats),
[type system](https://zed.brimdata.io/docs/formats/zed),
[query language](https://zed.brimdata.io/docs/language/overview),
and [`zq`](https://zed.brimdata.io/docs/commands/zq) command-line utility are
just a few of the tools Zed offers to the data community.

This package brings Zed into your browser.

## Example

```html
<script type="module">
  import { zq } from 'https://cdn.jsdelivr.net/npm/@brimdata/zed-wasm/index.js';

  const result = await zq({
    input: '1 2 3',
    program: 'this + 1',
  });

  console.log(result);
  /* (3) [Int64, Int64, Int64]
        0 : Int64 {value: '2', type: TypeOfInt64}
        1 : Int64 {value: '3', type: TypeOfInt64}
        2 : Int64 {value: '4', type: TypeOfInt64} */
</script>
```

## Installation

The easiest way to work with the published version of zed-wasm is to use a CDN
like [JsDelivr](https://www.jsdelivr.com/). Use the URL below inside of a
`script` tag with the `type` property set to `"module"`.

```js
const { zq } = await import('https://cdn.jsdelivr.net/npm/@brimdata/zed-wasm/index.js');
```

## API

Only the zq function is exposed at the moment. It takes an options object and returns an array of Zed Value Objects.

```js
function zq(options: {
  input?: string | File | Blob | ReadableStream | any[];
  program?: string;
  inputFormat?: InputFormat; // Defaults to auto
  outputFormat?: "js" | "zed" // Defaults to js
}): Promise<any[]>;

type InputFormat =
  | 'auto'
  | 'arrows'
  | 'csv'
  | 'json'
  | 'line'
  | 'zeek'
  | 'zjson'
  | 'zng'
  | 'zson';
```

### Running Browser Tests

Tests are written with Mocha. To run them:

```
yarn nx test-browser zed-wasm
```

When you make changes, run `yarn nx build zed-wasm`, then reload the page.
