
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import classNames from "classnames";
import styled from "styled-components";

import { Space } from "../state/Spaces/types";
import { initSpace } from "../flows/initSpace";
import { showContextMenu } from "../lib/System";
import Current from "../state/Current";
import EmptySection from "./common/EmptySection";
import FileFilled from "../icons/FileFilled";
import ProgressIndicator from "./ProgressIndicator";
import SpaceIcon from "./SpaceIcon";
import brim from "../brim";
import menu from "../electron/menu";

type Props = {
  spaces: Space[];
  spaceContextMenu: Function;
};

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  overflow: hidden;
`;

export default function SavedSpacesList({
  spaces,
  spaceContextMenu
}: Props) {
  const dispatch = useDispatch();
  const currentSpaceId = useSelector(Current.getSpaceId);
  const onClick = space => e => {
    e.preventDefault();
    dispatch(initSpace(space));
  };

  if (spaces.length === 0) return <EmptySection icon={<FileFilled />} message="You have no spaces yet. Create a space by importing data." />;

  return <menu className="saved-spaces-list">
      {spaces.sort((a, b) => a.name > b.name ? 1 : -1).map(brim.space).map(s => {
      const progress = s.ingesting() && <div className="small-progress-bar">
              <ProgressIndicator percent={s.ingestProgress()} />
            </div>;
      return <li key={s.id}>
              <a href="#" onClick={onClick(s.id)} onContextMenu={() => {
          !s.ingesting() && showContextMenu(spaceContextMenu(s.id, s.name));
        }} className={classNames("space-link", {
          "current-space-link": s.id === currentSpaceId
        })}>
                <NameWrap>
                  <SpaceIcon type={s.getType()} className="space-icon" />
                  <span className="name">{s.name}</span>
                </NameWrap>
                {progress}
              </a>
            </li>;
    })}
    </menu>;
}