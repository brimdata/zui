
import React from "react";
import styled from "styled-components";

import { Styled } from "../../../types/styled";
import MagnifyingGlass from "../../../icons/MagnifyingGlass";
import TextInput from "./TextInput";

const Wrapper: Styled<> = styled.div`
  position: relative;
  input {
    border-radius: 7px;
    padding-left: 26px;
  }

  svg {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 7px;
    left: 9px;
    fill: var(--slate);
  }
`;

export default function SearchInput(props: any) {
  return <Wrapper>
      <MagnifyingGlass />
      <TextInput {...props} />
    </Wrapper>;
}