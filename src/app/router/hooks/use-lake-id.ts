import {useSelector} from "react-redux"
import Current from "src/js/state/Current"

export default function useLakeId() {
  return useSelector(Current.getLakeId)
}
