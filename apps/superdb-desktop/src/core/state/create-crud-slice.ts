import {
  EntityAdapter,
  EntityId,
  EntityState,
  PayloadAction,
  Update,
  createSlice,
} from "@reduxjs/toolkit"

export function createCrudSlice<T>(opts: {
  name: string
  adapter: EntityAdapter<T, string>
}) {
  const {name, adapter} = opts

  function getId(arg: T | EntityId) {
    return typeof arg === "string" || typeof arg === "number"
      ? arg
      : adapter.selectId(arg)
  }

  return createSlice({
    name,
    initialState: {ids: [], entities: {}} as EntityState<T, string>,
    reducers: {
      sync: (state, action: PayloadAction<T[]>) => {
        adapter.setAll(state as EntityState<T, string>, action.payload)
      },
      create: (state, action: PayloadAction<T | T[]>) => {
        if (Array.isArray(action.payload)) {
          adapter.addMany(state as EntityState<T, string>, action.payload)
        } else {
          adapter.addOne(state as EntityState<T, string>, action.payload)
        }
      },
      update: (
        state,
        action: PayloadAction<Update<T, string> | Update<T, string>[]>
      ) => {
        if (Array.isArray(action.payload)) {
          adapter.updateMany(state as EntityState<T, string>, action.payload)
        } else {
          adapter.updateOne(state as EntityState<T, string>, action.payload)
        }
      },
      upsert: (state, action: PayloadAction<T | T[]>) => {
        if (Array.isArray(action.payload)) {
          adapter.upsertMany(state as EntityState<T, string>, action.payload)
        } else {
          adapter.upsertOne(state as EntityState<T, string>, action.payload)
        }
      },
      delete: (state, action: PayloadAction<string | string[] | T | T[]>) => {
        if (Array.isArray(action.payload)) {
          adapter.removeMany(
            state as EntityState<T, string>,
            action.payload.map(getId) as any
          )
        } else {
          adapter.removeOne(
            state as EntityState<T, string>,
            getId(action.payload) as any
          )
        }
      },
      deleteAll: (state) => {
        adapter.removeAll(state as EntityState<T, string>)
      },
    },
  })
}
