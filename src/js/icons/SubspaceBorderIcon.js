/* @flow */

import React from "react"
import styled from "styled-components"

import type {Styled} from "../types/styled"
import SubspaceBorderSvg from "../../static/icons/subspace-border.svg"

function Icon(props: *) {
  return <SubspaceBorderSvg {...props} />
}

const SubspaceBorderIcon: Styled<> = styled(Icon)`
  fill: var(--aqua);
  .chunk {
    fill: var(--azure);
  }
`

export default SubspaceBorderIcon
