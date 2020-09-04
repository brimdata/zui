

import { SearchRecord } from "../../types";

export type LastState = {
  search: SearchRecord | null | undefined;
};
export type LastAction = LAST_SEARCH_SET;

export type LAST_SEARCH_SET = {type: "LAST_SEARCH_SET";search: SearchRecord;};