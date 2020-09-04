
import { Thunk } from "../state/types";
import Current from "../state/Current";
import Spaces from "../state/Spaces";
import { getZealot } from "./getZealot";

export default function refreshSpaceNames(): Thunk {
  return (dispatch, getState, {
    globalDispatch
  }) => {
    const zealot = dispatch(getZealot());
    return zealot.spaces.list().then(spaces => {
      spaces = spaces || [];
      let id = Current.getConnectionId(getState());
      if (id) return globalDispatch(Spaces.setSpaces(id, spaces));
    });
  };
}