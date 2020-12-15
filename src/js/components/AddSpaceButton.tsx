import {useDispatch} from "react-redux"
import React from "react"
import styled from "styled-components"
import {setSpaceId} from "../state/Current/actions"

const StyledAnchor = styled.a`
  margin-left: auto;
  margin-right: 8px;
  background: rgba(0, 0, 0, 0);
  width: 24px;
  height: 18px;
  border-radius: 3px;
  text-align: center;
  line-height: 16px;
  font-weight: 300;
  font-size: 18px;
  color: var(--slate);
  ${(props) => props.theme.hoverQuiet}
`

export default function AddSpaceButton() {
  const dispatch = useDispatch()
  const onClick = () => dispatch(setSpaceId(null))

  return (
    <StyledAnchor className="add-space" onClick={onClick}>
      +
    </StyledAnchor>
  )
}
