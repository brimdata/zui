import TableColumns from "../models/TableColumns"
import {prepareProgram} from "./exportResults"

test("prepare program", async () => {
  const columns = new TableColumns("yo", [])
  const p = prepareProgram("csv", "*", columns)

  expect(p).toBe("* | fuse")
})
