import {
  Comparer,
  createAction,
  createEntityAdapter,
  createReducer,
  EntityId,
  EntityState,
  Update,
} from "@reduxjs/toolkit"

type Options<T> = {
  name: string
  select: (root: any) => EntityState<T>
  id?: (model: T) => EntityId
  sort?: Comparer<T>
}

export function createEntitySlice<T, Meta = undefined>(options: Options<T>) {
  const adapter = createEntityAdapter<T>({
    selectId: options.id,
    sortComparer: options.sort,
  })
  const select = adapter.getSelectors(options.select)

  const selectors = {
    find: (id: EntityId) => (state: unknown) => select.selectById(state, id),
    all: select.selectAll,
    count: select.selectTotal,
    ids: select.selectIds,
    entities: select.selectEntities,
  }
  function makeAction<Payload = undefined>(name: string) {
    return createAction(
      `${options.name}/${name}`,
      (
        payload: Payload = undefined,
        ...rest: Meta extends undefined ? [] : [meta: Meta]
      ) => {
        return {payload, meta: rest[0]}
      }
    )
  }
  const actions = {
    create: makeAction<T | T[]>("create"),
    update: makeAction<Update<T> | Update<T>[]>("update"),
    upsert: makeAction<T | T[]>("upsert"),
    delete: makeAction<string | string[]>("delete"),
    deleteAll: makeAction<undefined>("deleteAll"),
  }

  const reducer = createReducer(adapter.getInitialState(), (builder) => {
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
        adapter.removeMany(state as EntityState<T>, action.payload)
      } else {
        adapter.removeOne(state as EntityState<T>, action.payload)
      }
    })

    builder.addCase(actions.deleteAll, (state) => {
      adapter.removeAll(state as EntityState<T>)
    })
  })

  return {
    ...actions,
    ...selectors,
    reducer,
  }
}
