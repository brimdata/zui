import {createEntityAdapter} from "@reduxjs/toolkit"
import {createCrudSelectors, createCrudSlice} from "./create-crud-slice"

export function createEntitySlice<T>(opts) {
  const adapter = createEntityAdapter<T>({
    selectId: opts.id,
    sortComparer: opts.sort,
  })
  const slice = createCrudSlice({
    name: opts.name,
    adapter,
  })
  const selectors = createCrudSelectors(adapter.getSelectors(opts.select))
  return {
    reducer: slice.reducer,
    ...slice.actions,
    ...selectors,
  }
}
