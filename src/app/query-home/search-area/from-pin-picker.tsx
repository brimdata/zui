import React from "react"
import {showContextMenu} from "src/js/lib/System"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import styled from "styled-components"
import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Icon from "src/app/core/icon-temp"
import {cssVar} from "polished"
import {MenuItemConstructorOptions} from "electron"
import {newQueryVersion} from "../flows/new-query-version"

const DropdownIcon = styled(Icon).attrs({name: "chevron-down"})``

const PickerWrapper = styled.button<{isDisabled?: boolean}>`
  ${(p) => p.theme.typography.labelSmall}
  font-family: ${cssVar("--mono-font")};
  font-size: 12px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hawkes-blue);
  border-radius: 10px;
  padding: 3px 18px;
  border: none;
  margin: 0 3px 6px 16px;

  ${(p) =>
    p.isDisabled &&
    `
    cursor: not-allowed;
  `}

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
    ? [
        {
          label: "Unselect Pool",
          click: async () => {
            await dispatch(
              newQueryVersion(query.id, {
                ...query.currentVersion(),
                pins: {from: "", filters: query.getFilterPins()},
              })
            )
          },
        },
        {
          type: "separator",
        } as MenuItemConstructorOptions,
        ...pools.map((p) => ({
          label: p.name,
          click: async () => {
            // TODO: for pins 2.0, lets just store the new from-pin in searchbar state here.
            //  Creation of the new version can happen when user decides to actually execute
            //  the search (submit-search() will then handle this)
            await dispatch(
              newQueryVersion(query.id, {
                ...query.currentVersion(),
                pins: {from: p.id, filters: query.getFilterPins()},
              })
            )
          },
        })),
      ]
    : [
        {
          label: "No pools in lake",
          enabled: false,
        },
      ]

  showContextMenu(template)
}

type Props = {
  isDisabled?: boolean
}

const FromPinPicker = ({isDisabled}: Props) => {
  const dispatch = useDispatch()
  const currentPool = useSelector(Current.getQueryPool)

  return (
    <PickerWrapper
      isDisabled={isDisabled}
      onClick={() => !isDisabled && dispatch(showPoolMenu())}
    >
      <From>from</From>
      <PoolName>{currentPool?.name || "<none>"}</PoolName>
      <DropdownIcon />
    </PickerWrapper>
  )
}

export default FromPinPicker
