# Entity Slice Docs

A simple CRUD API for objects in a redux store.

Use this library anywhere you need to store a list of objects in redux. Benefit from predicatable actions, payloads, and selectors. Under the hood, it wraps redux toolkit's createEntityAdapter, but favors a terse api inspired by the Ruby on Rails ORM, ActiveRecord.

Example:

```js
/* CREATE THE ENTITY SLICE */
const stuff = createEntitySlice({
  name: "stuff",
})

/* USE THE REDUCER */
createStore(stuff.reducer)

/* CREATE */
dispatch(stuff.create({id: "1", name: "ball", fun: true}))

/* UPDATE */
dispatch(stuff.update({id: "1", changes: {fun: false}}))

/* DELETE */
dispatch(stuff.delete("1"))

/* FIND */
stuff.find(state, "1")

/* ALL */
stuff.all(state)
```

## API Reference

Each entity slice contains the following actions.

_Actions_

1. create
2. update
3. upsert
4. delete
5. deleteAll
6. sync

_Selectors_

1. find
2. all
3. count
4. ids
5. entities

There are two exported functions to choose from.

1. useEntitySlice(opts)
2. useNestedEntitySlice(opts)

## FAQ

Q. Why not just use createEntityAdapter?

A. It doesn't go far enough. It still requires too much boilerplate for things I need in every slice.
