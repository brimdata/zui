import {getAllTabs} from "src/js/test/helpers/getTestState"

export default function addMainView(state: any) {
  // Migrate state here
  for (let tab of getAllTabs(state)) {
    tab.layout.mainView = "search"
  }
  return state
}
