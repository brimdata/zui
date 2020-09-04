import { $Shape } from "utility-types";


import { isEqual } from "lodash";

import { Finding, InvestigationAction, InvestigationState } from "./types";
import { SearchRecord } from "../../types";
import { Ts } from "../../brim";
import { last } from "../../lib/Array";

const init: InvestigationState = [];

export default function reducer(state: InvestigationState = init, a: InvestigationAction): InvestigationState {
  switch (a.type) {
    case "INVESTIGATION_PUSH":
      return createFinding(state, a.entry, a.ts);
    case "FINDING_CREATE":
      return [...state, a.finding];
    case "FINDING_UPDATE":
      return updateLatest(state, a.finding);
    case "FINDING_DELETE":
      return state.filter(f => {
        // $FlowFixMe
        for (let ts of a.ts) if (isEqual(ts, f.ts)) return false;
        return true;
      });
    case "INVESTIGATION_CLEAR":
      return [];
    default:
      return state;

  }
}

function updateLatest(state: InvestigationState, updates: $Shape<Finding>) {
  var finding = last(state);
  if (finding) {
    state[state.length - 1] = { ...finding, ...updates };
    return [...state];
  } else {
    return state;
  }
}

function createFinding(state, search: SearchRecord, ts: Ts) {
  if (sameRecord(last(state), { ts, search })) {
    return state;
  } else {
    return [...state, { ts, search }];
  }
}

function sameRecord(a: Finding, b: Finding) {
  return !!a && !!b && isEqual(a.search, b.search);
}