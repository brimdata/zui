

import { State } from "../types";

export default {
  getError: (state: State) => state.notice.error,
  getVisible: (state: State) => state.notice.visible
};