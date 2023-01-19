import {ListViewApi} from "./list-view-api"
import {ListViewArgs} from "./types"

export function createListView(args: ListViewArgs) {
  return new ListViewApi(args)
}
