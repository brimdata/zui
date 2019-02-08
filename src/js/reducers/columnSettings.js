/* @flow */
import createReducer from "./createReducer"

export type Column = {
  name: string,
  type: string,
  isVisible: boolean,
  width: ?number
}

export type ColumnSettings = {
  [string]: Column[]
}

const initialState = {}

export default createReducer(initialState, {
  COLUMNS_SET_FROM_DESCRIPTOR: (state, {group, descriptor}) => {
    const oldColumns = state[group] || []
    const defaults = {width: undefined, isVisible: true}

    const columns = descriptor.map(field => ({
      ...(oldColumns.find(c => c.name === field.name) || defaults),
      ...field
    }))

    return {
      ...state,
      [group]: columns
    }
  },

  COLUMN_WIDTHS_SET: (state, {group, widths}) => ({
    ...state,
    [group]: state[group].map(column => {
      if (widths[column.name]) {
        return {
          ...column,
          width: widths[column.name]
        }
      } else {
        return column
      }
    })
  }),

  COLUMN_VISIBILITY_SET: (state, {group, index, isVisible}) => {
    const cols = [...state[group]]
    cols[index].isVisible = isVisible

    return {
      ...state,
      [group]: cols
    }
  }
})
