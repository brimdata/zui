
import { isEmpty } from "lodash";

import { Thunk } from "../state/types";
import Current from "../state/Current";
import Handlers from "../state/Handlers";
import Spaces from "../state/Spaces";
import showIngestWarning from "./showIngestWarning";

export default ((): Thunk => (dispatch, getState) => {
  let spaceIds = Handlers.getIngestSpaceIds(getState());

  if (isEmpty(spaceIds)) {
    return Promise.resolve();
  } else {
    let clusterId = Current.getConnectionId(getState());
    if (!clusterId) return;
    let names = spaceIds.map(id => {
      let space = Spaces.get(clusterId, id)(getState());
      if (space) return space.name;else return id;
    });
    return showIngestWarning(names);
  }
});