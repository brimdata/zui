import React from "react"
import {createFrom} from "src/app/commands/pins"
import Icon from "src/app/core/icon-temp"
import styled from "styled-components"
import {Button, Prefix} from "./base-pin"

export const Text = styled(Prefix)`
  color: var(--placeholder-color);
  opacity: 1;
`

export const PlaceholderPin = styled(Button)`
  --placeholder-color: var(--foreground-color);

  background: transparent;
  border: 1px dashed var(--placeholder-color);
  color: var(--placeholder-color);
  opacity: 0.2;
  &:hover {
    background: transparent;
    opacity: 0.5;
  }
`

export function PlaceholderFromPin() {
  return (
    <PlaceholderPin onClick={() => createFrom.run()}>
      <Text>FROM</Text>
      <Icon name="plus" fill="var(--placeholder-color)" size={9} />
    </PlaceholderPin>
  )
}
