

import React, { Node } from "react";

import { Rect, useResizeObserver } from "./hooks/useResizeObserver";

type Props = {
  render: (arg0: Rect) => Node;
};

export default function Dimens({
  render,
  ...props
}: Props) {
  let {
    rect,
    ref
  } = useResizeObserver();
  return <div {...props} ref={ref}>
      {render(rect)}
    </div>;
}