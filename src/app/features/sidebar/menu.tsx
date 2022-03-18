import React from "react"
import styled from "styled-components"
import Icon from "src/app/core/icon-temp"
import {useDispatch} from "src/app/core/state"
import {useSelector} from "react-redux"
import Appearance from "src/js/state/Appearance"

const BG = styled.div`
  display: flex;
  padding: 0 6px;

  button {
    background: none;
    border: none;
    display: flex;
    opacity: 0.5;
    border-radius: 5px;
    padding: 0 6px;

    span {
      height: 22px;
      display: flex;
      align-items: center;
      font-weight: 600;
      border-bottom: 2px solid transparent;
      padding: 4px;
    }

    svg {
      width: 14px;
      height: 14px;
      margin-right: 4px;
      fill: var(--foreground-color);
      opacity: 0.5;
      display: none;
    }

    &[aria-pressed="true"] {
      opacity: 1;

      span {
        border-bottom: 2px solid var(--primary-color);
      }
    }

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: rgba(0, 0, 0, 0.08);
    }
  }
`

export function Menu() {
  const dispatch = useDispatch()
  const currentSectionName = useSelector(Appearance.getCurrentSectionName)
  const onClick = (name) => () =>
    dispatch(Appearance.setCurrentSectionName(name))
  return (
    <BG>
      <button
        onClick={onClick("pools")}
        aria-pressed={currentSectionName === "pools"}
      >
        <span>
          <Icon name="pool" /> Pools
        </span>
      </button>
      <button
        onClick={onClick("queries")}
        aria-pressed={currentSectionName === "queries"}
      >
        <span>
          <Icon name="doc-plain" /> Queries
        </span>
      </button>
      <button
        onClick={onClick("history")}
        aria-pressed={currentSectionName === "history"}
      >
        <span>
          <Icon name="history" /> History
        </span>
      </button>
    </BG>
  )
}
