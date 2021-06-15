import {getAllTabs} from "src/js/state/migrations/utils/getTestState"

export default function addMainView(state: any) {
  // Migrate state here
  for (let tab of getAllTabs(state)) {
    tab.layout.mainView = "search"
  }
  return state
}
