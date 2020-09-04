
import Current from "../state/Current";
import { Thunk } from "../state/types";

export const getZealot = (): Thunk => (dispatch, getState, {
  createZealot
}) => {
  return createZealot(Current.getConnectionId(getState()));
};