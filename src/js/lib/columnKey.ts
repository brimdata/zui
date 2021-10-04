import {ColumnName} from "../state/Columns/models/column"
import {toFieldPath} from "../zql/toZql"

export default (col: ColumnName) => {
  return toFieldPath(col)
}
