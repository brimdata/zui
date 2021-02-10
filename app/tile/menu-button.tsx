import Icon from "app/core/Icon"
import {dispatch} from "d3"
import React from "react"
import {useDispatch} from "react-redux"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import {removeHeadProc} from "src/js/lib/Program"
import {showContextMenu} from "src/js/lib/System"
import Layout from "src/js/state/Layout"
import SearchBar from "src/js/state/SearchBar"
import styled from "styled-components"
import {query} from "winston"

const BG = styled.div`
  position: relative;
  padding: 6px;
  svg {
    width: 12px;
    height: 12px;
    z-index: 1;
    fill: var(--slate);
  }
  &:before {
    content: "";
    background: var(--hover-light-bg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 100ms;
  }
  &:hover:before {
    transform: scale(1);
  }
`

const showMenu = (query) => (dispatch) => {
  showContextMenu([
    {
      label: "Show all records",
      click() {
        dispatch(SearchBar.changeSearchBarInput(removeHeadProc(query)))
        dispatch(Layout.setMainView("search"))
        dispatch(submitSearch())
      }
    }
  ])
}

type Props = {
  query: string
}

export default function MenuButton({query}: Props) {
  const dispatch = useDispatch()

  return (
    <BG onClick={() => dispatch(showMenu(query))} className="menu-button">
      <Icon name="three-dots" />
    </BG>
  )
}
