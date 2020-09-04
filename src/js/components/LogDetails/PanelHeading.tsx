

import React from "react";

import LoadingBurst from "../LoadingBurst";

type Props = {
  children: any;
  status?: string | null | undefined;
};

const PanelHeading = ({
  status,
  children
}: Props) => <div className="panel-heading">
    <h4 className="panel-title">{children}</h4>
    <LoadingBurst show={status === "FETCHING"} />
  </div>;

export default PanelHeading;