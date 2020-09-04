

import React from "react";
import styled from "styled-components";

import { Styled } from "../types/styled";
import SubspaceBorderSvg from "../../static/icons/subspace-border.svg";

function Icon(props: any) {
  return <SubspaceBorderSvg {...props} />;
}

const SubspaceBorderIcon: Styled<> = styled(Icon)`
  fill: var(--aqua);
  .chunk {
    fill: var(--azure);
  }
`;

export default SubspaceBorderIcon;