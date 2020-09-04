

import { isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import classNames from "classnames";

import { ingestProgressBar } from "../test/locators";
import { isNumber } from "../lib/is";
import { reactElementProps } from "../test/integration";
import Current from "../state/Current";
import Modal from "../state/Modal";
import ProgressIndicator from "./ProgressIndicator";
import Spaces from "../state/Spaces";
import Warning from "./icons/warning-sm.svg";
import brim from "../brim";

export default function StatusBar() {
  let dispatch = useDispatch();
  let clusterID = useSelector(Current.getConnectionId);
  let spaceId = useSelector(Current.getSpaceId);
  let space = useSelector(Current.getSpace);
  let value = useSelector(Spaces.getIngestProgress(clusterID, spaceId));
  let warnings = useSelector(Spaces.getIngestWarnings(clusterID, spaceId));
  if (!isNumber(value) && isEmpty(warnings)) return null;
  let s = brim.space(space);

  function onWarningsClick() {
    dispatch(Modal.show("ingest-warnings"));
  }

  function getMessage() {
    if (s.queryable() && s.ingesting()) {
      return "Partial data available while loading…";
    }
  }

  return <div className="status-bar">
      <div className="packet-post-progress" {...reactElementProps("ingestProgress")}>
        <label>{getMessage()}</label>
        <div className="group">
          {s.ingesting() && <ProgressIndicator {...ingestProgressBar.props} percent={value} />}
          {!s.ingesting() && s.empty() && <label>Ingest failed with warnings.</label>}
          <div className={classNames("warnings", {
          disabled: isEmpty(warnings) || !s.queryable()
        })} onClick={onWarningsClick}>
            <Warning />
            <label>{warnings.length}</label>
          </div>
        </div>
      </div>
    </div>;
}