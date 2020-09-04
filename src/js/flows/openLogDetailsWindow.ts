

import invoke from "../electron/ipc/invoke";
import ipc from "../electron/ipc";
import { Thunk } from "redux-thunk";
import { mustGetConnection } from "../state/Current/selectors";

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  const {
    host,
    port
  } = mustGetConnection(getState());
  invoke(ipc.windows.open("detail", { size: [700, 600], query: { host, port } }, getState()));
};