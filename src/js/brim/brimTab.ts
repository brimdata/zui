

import { get } from "lodash";

import { SpacesState } from "../state/Spaces/types";
import { TabState } from "../state/Tab/types";
import lib from "../lib";

export default function (tab: TabState, spaces: SpacesState) {
  return {
    title() {
      const name = get(spaces, [tab.current.connectionId || "", tab.current.spaceId || "", "name"], "New Tab");
      return lib.compact([name, tab.searchBar.previous]).join(": ");
    }
  };
}