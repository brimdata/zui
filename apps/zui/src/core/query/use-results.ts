import {useSelector} from "react-redux"
import Results from "src/js/state/Results"

export function useResults(id: string) {
  const data = useSelector(Results.getValues(id))
  const status = useSelector(Results.getStatus(id))
  const shapes = useSelector(Results.getShapes(id))
  const error = useSelector(Results.getError(id))
  return {data, status, shapes, error}
}
