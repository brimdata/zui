

import { SearchRecord } from "../../types";

export const setSearch = (search: SearchRecord) => ({
  type: "LAST_SEARCH_SET",
  search
});