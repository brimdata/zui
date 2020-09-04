

import { includes } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import ReactTooltip from "react-tooltip";
import classNames from "classnames";
import get from "lodash/get";
import styled from "styled-components";

import { Finding } from "../../state/Investigation/types";
import { globalDispatch } from "../../state/GlobalContext";
import { submitSearch } from "../../flows/submitSearch/mod";
import Current from "../../state/Current";
import FindingProgram from "./FindingProgram";
import Investigation from "../../state/Investigation";
import MagnifyingGlass from "../../icons/MagnifyingGlass";
import Search from "../../state/Search";
import Spaces from "../../state/Spaces/selectors";
import Warning from "../icons/warning-sm.svg";
import usePopupMenu from "../hooks/usePopupMenu";

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
    fill: ${props => props.theme.colors.lead};
    min-width: 13px;
    width: 13px;
    min-height: 13px;
    height: 13px;
  }
`;

type Props = {finding: Finding;};

export default React.memo<Props>(function FindingCard({
  finding
}: Props) {
  const dispatch = useDispatch();
  const clusterId = useSelector(Current.getConnectionId);
  const spaceIds = useSelector(Spaces.ids(clusterId));
  const findingSpaceName = get(finding, ["search", "spaceName"], "");

  function onClick() {
    dispatch(Search.restore(finding.search));
    dispatch(submitSearch({ history: true, investigation: false }));
  }

  function renderWarning() {
    const findingSpaceId = get(finding, ["search", "spaceId"], "");
    const tip = "This space no longer exists";

    if (includes(spaceIds, findingSpaceId)) return null;

    return <div className="warning-body" data-tip={tip} data-effect="solid" data-place="right">
        <Warning />
        <ReactTooltip />
      </div>;
  }

  const menu = usePopupMenu([{
    label: "Delete",
    click: () => globalDispatch(Investigation.deleteFindingByTs(finding.ts))
  }, { type: "separator" }, {
    label: "Delete All",
    click: () => globalDispatch(Investigation.clearInvestigation())
  }]);

  return <div className={classNames("finding-card-wrapper")} onClick={onClick} onContextMenu={() => menu.open()} title={findingSpaceName}>
      <div className="finding-card">
        <StyledMagnifyingGlass />
        <FindingProgram search={finding.search} />
        {renderWarning()}
      </div>
    </div>;
});