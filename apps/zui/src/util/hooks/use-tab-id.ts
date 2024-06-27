import {useSelector} from "react-redux"
import Tabs from "src/js/state/Tabs"

export function useTabId() {
  return useSelector(Tabs.getActive)
}
