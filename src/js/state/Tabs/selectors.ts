
import { createSelector } from "reselect";

import { State } from "../types";
import { TabState } from "../Tab/types";
import { TabsState } from "./types";

const getData = (state: State) => state.tabs.data;
const getActive = (state: State) => state.tabs.active;
const getCount = (state: State) => state.tabs.data.length;

const getActiveTab = createSelector<State, void, TabState, TabsState>(state => state.tabs, tabs => {
  let tab = tabs.data.find(t => t.id === tabs.active);
  if (!tab) throw new Error("Can't find active tab");
  return tab;
});

export default {
  getData,
  getActive,
  getCount,
  getActiveTab
};