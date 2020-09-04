

import { connect, useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { Dispatch } from "../state/types";
import CircleChevron from "./CircleChevron";
import MouseoverWatch from "../lib/MouseoverWatch";
import dispatchToProps from "../lib/dispatchToProps";
import Layout from "../state/Layout";

type Props = {
  show: boolean;
  dispatch: Dispatch;
};

type OwnProps = {
  show: boolean;
};

export function LeftPaneCollapser() {
  let dispatch = useDispatch();
  let [show, setShow] = useState(false);
  let width = useSelector(Layout.getLeftSidebarWidth);

  useEffect(() => {
    let watcher = new MouseoverWatch().addListener().condition(([x]) => x < width).onEnter(() => setShow(true)).onExit(() => setShow(false));

    return () => {
      watcher.removeListener();
    };
  });

  function onClick() {
    dispatch(Layout.hideLeftSidebar());
  }

  return <div className={classNames("left-pane-collapser", { show })} onClick={onClick}>
      <CircleChevron collapse left dark />
    </div>;
}

export const XLeftPaneCollapser = connect<Props, OwnProps, _, _, _, _>(null, dispatchToProps)(LeftPaneCollapser);