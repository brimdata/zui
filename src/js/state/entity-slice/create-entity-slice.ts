import {
  Comparer,
  createAction,
  createEntityAdapter,
  createReducer,
  EntityAdapter,
  EntityId,
  EntityState,
  IdSelector,
  Update,
} from "@reduxjs/toolkit"

type Options<T> = {
  name: string
  id?: (model: T) => EntityId
  select?: (state: unknown) => EntityState<T>
  sort?: Comparer<T>
}

type NestedOptions<T, Meta, NestedArgs extends any[]> = {
  name: string
  id?: (model: T) => EntityId
  select?: (state: unknown, meta: Meta) => EntityState<T>
  sort?: Comparer<T>
  meta: (...args: NestedArgs) => Meta
}

export function createEntitySlice<T>(options: Options<T>) {
  const adapter = makeAdapter(options)
  const actions = makeActions(options.name)
  const reducer = makeReducer(adapter, actions, options.id)
  const selectors = makeSelectors(adapter, options.select)
  return {
    ...actions,
    ...selectors,
    reducer,
    name: options.name,
  }
}

export function createNestedEntitySlice<T, Meta, NestedArgs extends any[]>(
  options: NestedOptions<T, Meta, NestedArgs>
) {
  const adapter = makeAdapter(options)
  const actions = makeActions(options.name) // Just to make the reducer
  const reducer = makeReducer(adapter, actions, options.id)
  function at(...args: NestedArgs) {
    const meta = options.meta(...args)
    const actions = makeActions<T>(options.name, meta)
    const selectors = makeSelectors<T>(adapter, (state: unknown) => {
      return options.select(state, meta)
    })
    return {...actions, ...selectors}
  }
  return {
    name: options.name,
    at,
    reducer,
  }
}

function makeAdapter<T>(options: {id?: IdSelector<T>; sort?: Comparer<T>}) {
  return createEntityAdapter<T>({
    selectId: options.id,
    sortComparer: options.sort,
  })
}

function makeAction<Payload, Meta = undefined>(
  slice: string,
  name: string,
  meta: Meta
) {
  const type = `${slice}/${name}`
  return createAction(type, (payload: Payload) => ({payload, meta}))
}

function makeActions<T>(slice: string, meta = undefined) {
  return {
    create: makeAction<T | T[]>(slice, "create", meta),
    update: makeAction<Update<T> | Update<T>[]>(slice, "update", meta),
    upsert: makeAction<T | T[]>(slice, "upsert", meta),
    delete: makeAction<string | string[] | T | T[]>(slice, "delete", meta),
    deleteAll: makeAction<void>(slice, "deleteAll", meta),
    sync: makeAction<T[]>(slice, "sync", meta),
  }
}

function makeSelectors<T>(adapter: EntityAdapter<T>, selector = undefined) {
  const select = adapter.getSelectors(selector)
  return {
    find: select.selectById,
    all: select.selectAll,
    count: select.selectTotal,
    ids: select.selectIds,
    entities: select.selectEntities,
  }
}

function makeReducer<T>(
  adapter: EntityAdapter<T>,
  actions: any,
  id: (item: T) => EntityId = (thing) => thing["id"]
) {
  function getId(arg: T | EntityId) {
    return typeof arg === "string" || typeof arg === "number" ? arg : id(arg)
  }

  return createReducer(adapter.getInitialState(), (builder) => {
    builder.addCase(actions.sync, (state, action) => {
      adapter.setAll(state as EntityState<T>, action.payload)
    })

    builder.addCase(actions.create, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.addMany(state as EntityState<T>, action.payload)
      } else {
        adapter.addOne(state as EntityState<T>, action.payload)
      }
    })

    builder.addCase(actions.update, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.updateMany(state as EntityState<T>, action.payload)
      } else {
        adapter.updateOne(state as EntityState<T>, action.payload)
      }
    })

    builder.addCase(actions.upsert, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.upsertMany(state as EntityState<T>, action.payload)
      } else {
        adapter.upsertOne(state as EntityState<T>, action.payload)
      }
    })

    builder.addCase(actions.delete, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.removeMany(state as EntityState<T>, action.payload.map(getId))
      } else {
        adapter.removeOne(state as EntityState<T>, getId(action.payload))
      }
    })

    builder.addCase(actions.deleteAll, (state) => {
      adapter.removeAll(state as EntityState<T>)
    })
  })
}

export function initialState() {
  return {ids: [], entities: {}}
}
