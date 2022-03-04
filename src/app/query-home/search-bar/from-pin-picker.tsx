import React from "react"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import styled from "styled-components"
import {useDispatch, useSelector} from "react-redux"
import Icon from "src/app/core/icon-temp"
import {cssVar} from "polished"
import {updateQuery} from "../flows/update-query"

const DropdownIcon = styled(Icon).attrs({name: "chevron-down"})``

const PickerWrapper = styled.button`
  ${(p) => p.theme.typography.labelSmall}
  font-family: ${cssVar("--mono-font")};
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hawkes-blue);
  border-radius: 10px;
  padding: 2px 12px 4px;
  border: none;
  margin: 7px 0 6px;
  
  ${DropdownIcon} > svg {
    stroke: var(--cello-transparent);
    fill: var(--cello-transparent);
    width: 12px;
    height: 12px;
  }
`

const From = styled.span`
  color: var(--cello-transparent);
`

const PoolName = styled.span`
  margin: 0 10px;
`

const showPoolMenu = () => (dispatch, getState) => {
  const s = getState()
  const lakeId = Current.getLakeId(s)
  const query = Current.getQuery(s)
  const pools = Pools.getPools(lakeId)(s)

  const template = pools
    ? pools.map((p) => ({
        label: p.name,
        click: () => {
          query.setFromPin(p.id)
          dispatch(updateQuery(query))
        }
      }))
    : [
        {
          label: "No pools in lake",
          enabled: false
        }
      ]

  showContextMenu(template)
}

const FromPinPicker = () => {
  const dispatch = useDispatch()
  const currentPool = useSelector(Current.getQueryPool)

  // TODO: Mason - need designs for empty state and pin (from & filter) creator flow
  return (
    <PickerWrapper onClick={() => dispatch(showPoolMenu())}>
      <From>from</From>
      <PoolName>{currentPool?.name || "<none>"}</PoolName>
      <DropdownIcon />
    </PickerWrapper>
  )
}

export default FromPinPicker
