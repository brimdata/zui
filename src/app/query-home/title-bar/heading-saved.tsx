import React, {useRef} from "react"
import {useSelector} from "react-redux"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import {showContextMenu} from "src/js/lib/System"
import Queries from "src/js/state/Queries"
import styled from "styled-components"
import popupPosition from "../search-area/popup-position"
import getQueryListMenu from "../toolbar/flows/get-query-list-menu"
import {ActiveQuery} from "./active-query"
import {HeadingButton} from "./heading-button"

const Title = styled.h2`
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
`

const Dropdown = styled(Icon).attrs({name: "chevron-down", size: 16})``

export function HeadingSaved({active}: {active: ActiveQuery}) {
  const dispatch = useDispatch()
  const ref = useRef<HTMLButtonElement>()
  const anyQueries = useSelector(Queries.any)
  const onClick = () => {
    showContextMenu(dispatch(getQueryListMenu()), {
      ...popupPosition(ref.current),
    })
  }

  if (!anyQueries) return

  return (
    <HeadingButton onClick={onClick} ref={ref}>
      <Title>{active.name()}</Title>
      <Dropdown />
    </HeadingButton>
  )
}
