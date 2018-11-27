export const setColumns = columns => ({
  type: "COLUMNS_SET",
  columns
})

export const toggleColumn = column => ({
  type: "COLUMNS_TOGGLE",
  column
})
