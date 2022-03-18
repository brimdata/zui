import React, {ReactNode} from "react"
import styled from "styled-components"
import Icon from "src/app/core/icon-temp"
import {Item} from "./item"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"
import {SectionName} from "src/js/state/Appearance/types"

export const StyledMenu = styled.menu`
  margin: 0 0 6px;
  padding: 0;
`

const MenuItem = (props: {
  name: SectionName
  text: string
  icon: ReactNode
}) => {
  const {icon, name, text} = props
  const dispatch = useDispatch()
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)
  const isCurrent = name === currentSectionName
  return (
    <Item
      onClick={() => dispatch(Appearance.setCurrentSectionName(name))}
      icon={icon}
      text={text}
      // @ts-ignore
      state={{isSelected: isCurrent}}
      // @ts-ignore
      styles={{}}
    />
  )
}

export function Menu() {
  return (
    <StyledMenu>
      <MenuItem name="pools" text="Pools" icon={<Icon name="pool" />} />
      <MenuItem
        name="queries"
        text="Queries"
        icon={<Icon name="doc-plain" />}
      />
      <MenuItem name="history" text="History" icon={<Icon name="history" />} />
    </StyledMenu>
  )
}
