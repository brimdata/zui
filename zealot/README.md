# Zealot Client

The Zealot Client is responsible for communicating with the zqd process via the rest api. It can ingest data, search data, get the list of spaces, and more. This folder is a Deno project written in TypeScript. You'll need to have that installed to run the tests and create the bundle.

### Installation

```
brew install deno
```

### Run Tests

```
make test
```

### Create Bundle

```
make bundle
```

This creates `zealot.js` in the root of this directory. The output is a browser compliant version of JavaScript. To use it in Brim, simply import it.

### Usage

```js
import {createZealot} from "./zealot"

const zealot = createZealot("localhost:9867")

// Once you have an instance you can do things like:
zealot.spaces.create({name: "my_space"})
zealot.spaces.list()

const resp = await zealot.search("192.4.53.101 | count()", {
  spaceId: "1", 
  from: new Date(0), 
  to: new Date()
})
const records = await resp.records()
```

More documentation to come.
