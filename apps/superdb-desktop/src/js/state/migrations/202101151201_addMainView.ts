import {getAllTabs_before_202307101053} from "src/js/state/migrations/utils/getTestState"

export default function addMainView(state: any) {
  // Migrate state here
  for (let tab of getAllTabs_before_202307101053(state)) {
    tab.layout.mainView = "search"
  }
  return state
}
