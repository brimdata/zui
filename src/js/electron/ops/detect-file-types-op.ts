import detectFileTypes from "src/js/models/ingest/detectFileTypes"
import {createOperation} from "../operations"

export const detectFileTypesOp = createOperation(
  "detectFileTypesOp",
  (ctx, files: File[]) => {
    return detectFileTypes(files)
  }
)
