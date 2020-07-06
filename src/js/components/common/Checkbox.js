/* @flow */
import React from "react"
import styled from "styled-components"

const HiddenCheckbox = styled.input.attrs({
  type: "checkbox"
})`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled.svg`
  fill: none;
  stroke: ${(props) => props.theme.colors.white};
  stroke-width: 3px;
`

const Label = styled.label`
  margin-left: 7px;
  color: ${(props) => props.theme.colors.slate};
  ${(props) => props.theme.typography.labelSmall}
`

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props) =>
    props.checked ? props.theme.colors.havelock : props.theme.colors.white};
  border-radius: 2px;
  transition: all 150ms;
  border: 1px solid
    ${(props) =>
      props.checked ? props.theme.colors.white : props.theme.colors.lead};

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`

type Props = {
  checked: boolean,
  label: string,
  onChange: Function
}

const Checkbox = ({className, checked, onChange, label, ...props}: Props) => (
  <label onChange={onChange}>
    <CheckboxContainer className={className}>
      <HiddenCheckbox defaultChecked={checked} {...props} />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
      <Label>{label}</Label>
    </CheckboxContainer>
  </label>
)

export default Checkbox
