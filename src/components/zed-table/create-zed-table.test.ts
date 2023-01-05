import {createRecord} from "src/test/shared/factories/zed-factory"
import {createZedTable} from "./create-zed-table"

test("createZedTable", () => {
  const _record = createRecord({
    name: "james",
    ids: [1, 2, 3],
    address: {
      street: "123 McDonalds",
      city: "San Francisco",
      state: "CA",
      zip: "90880",
    },
  })
  createZedTable
  // values: [record],
  // shape: record.type,
  // state: {
  //   valueExpanded: {},
  //   valuePage: {},
  //   columnExpanded: {},
  //   columnWidth: {},
  //   columnExpandedDefault: false,
  // },
  // onStateChange: () => {},
  //   })
})
