import {getAllTabs_before_202307101053} from "src/js/state/migrations/utils/getTestState"

export default function removeSearchBarFields(state: any) {
  // Remove unused parts of the search bar
  for (const tab of getAllTabs_before_202307101053(state)) {
    delete tab.searchBar.editing
    delete tab.searchBar.previous
    delete tab.searchBar.target
  }
  return state
}
