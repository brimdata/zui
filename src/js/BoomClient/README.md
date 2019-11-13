# Boom JavaScript Client

This client is used in the desktop application. It is for a node/electron environment.

## Test

```
npm test
```

## Develop

```
npm start
```

The code will automatically get built to `/dist` each time a file is changed.

## Versioning

```
npm version [patch, minor, major]
```

## Usage

Initialization

```js
const boom = new BoomClient({
  host,
  port,
  username,
  password,
  enableCache,
  enableIndex,
  timeout,
  searchSpan,
  searchSpace,
  searchQueryParams
})
```

## Options

All options accepted by the constructor can be updated or looked at with these:

```js
boom.setOptions(options) // In use
boom.getOptions() // In use
```

## Versions

Get the client version and server versions with these:

```js
boom.serverVersion()
boom.clientVersion()
```

## Spaces

```js
boom.spaces.list()
boom.spaces.get(name)
boom.spaces.create(data)
boom.spaces.delete(name)
```

## Search

Any options passed to search override the options passed in the constructor or set with setOptions().

```js
boom.search(zql, options)
```

## Descriptors

```js
boom.descriptors.list()
boom.descriptors.create(space, descriptor)
boom.descriptors.get(space, id)
```

## Tasks

```js
boom.tasks.list()
boom.tasks.get(id)
```

## Space Configurations

```js
boom.configs.get(spaceId)
boom.configs.update(spaceId, options)
```

## Space Indexes

```js
boom.indexes.create(spaceId, options)
boom.indexes.delete(spaceId)
```

## Packets

```js
boom.packets.get(space, packetId) // In use
```

## Typings

```js
boom.typings.list()
boom.typings.create()
```

## Ingesting

```js
boom.injest(spaceId, format, data)
```
