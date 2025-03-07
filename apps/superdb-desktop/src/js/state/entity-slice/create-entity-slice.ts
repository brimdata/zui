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
  select?: (state: unknown) => EntityState<T, string>
  sort?: Comparer<T>
}

type NestedOptions<T, Meta, NestedArgs extends any[]> = {
  name: string
  id?: (model: T) => EntityId
  select?: (state: unknown, meta: Meta) => EntityState<T, string>
  sort?: Comparer<T>
  meta: (...args: NestedArgs) => Meta
}

export function createEntitySlice<T>(options: Options<T>) {
  const id = options.id ?? ((thing) => thing["id"])
  const sort = options.sort ?? false
  const adapter = makeAdapter<T>(id, sort) as any
  const actions = makeActions<T>(options.name)
  const reducer = makeReducer<T>(adapter, actions, id)
  const selectors = makeSelectors<T>(adapter, options.select)
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
  const id = options.id ?? ((thing) => thing["id"])
  const sort = options.sort ?? false
  const adapter = makeAdapter<T>(id, sort) as any
  const actions = makeActions<T>(options.name) // Just to make the reducer
  const reducer = makeReducer<T>(adapter, actions, id)
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

function makeAdapter<T>(
  selectId: IdSelector<T, string>,
  sortComparer: Comparer<T> | false
) {
  return createEntityAdapter<T, string>({selectId, sortComparer})
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
    update: makeAction<Update<T, string> | Update<T, string>[]>(
      slice,
      "update",
      meta
    ),
    upsert: makeAction<T | T[]>(slice, "upsert", meta),
    delete: makeAction<string | string[] | T | T[]>(slice, "delete", meta),
    deleteAll: makeAction<void>(slice, "deleteAll", meta),
    sync: makeAction<T[]>(slice, "sync", meta),
  }
}

function makeSelectors<T>(
  adapter: EntityAdapter<T, string>,
  selector = undefined
) {
  const select = adapter.getSelectors<any>(selector)
  return {
    find: select.selectById,
    all: select.selectAll,
    count: select.selectTotal,
    ids: select.selectIds,
    entities: select.selectEntities,
  }
}

function makeReducer<T>(
  adapter: EntityAdapter<T, string>,
  actions: any,
  id: (item: T) => EntityId = (thing) => thing["id"]
) {
  function getId(arg: T | EntityId) {
    return typeof arg === "string" || typeof arg === "number" ? arg : id(arg)
  }

  return createReducer(adapter.getInitialState(), (builder) => {
    builder.addCase(actions.sync, (state, action) => {
      adapter.setAll(state as EntityState<T, string>, action.payload)
    })

    builder.addCase(actions.create, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.addMany(state as EntityState<T, string>, action.payload)
      } else {
        adapter.addOne(state as EntityState<T, string>, action.payload)
      }
    })

    builder.addCase(actions.update, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.updateMany(state as EntityState<T, string>, action.payload)
      } else {
        adapter.updateOne(state as EntityState<T, string>, action.payload)
      }
    })

    builder.addCase(actions.upsert, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.upsertMany(state as EntityState<T, string>, action.payload)
      } else {
        adapter.upsertOne(state as EntityState<T, string>, action.payload)
      }
    })

    builder.addCase(actions.delete, (state, action) => {
      if (Array.isArray(action.payload)) {
        adapter.removeMany(
          state as EntityState<T, string>,
          action.payload.map(getId)
        )
      } else {
        adapter.removeOne(
          state as EntityState<T, string>,
          getId(action.payload) as string
        )
      }
    })

    builder.addCase(actions.deleteAll, (state) => {
      adapter.removeAll(state as EntityState<T, string>)
    })
  })
}

export function initialState() {
  return {ids: [], entities: {}}
}
