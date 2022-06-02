import React from "react"
import styled from "styled-components"
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

    border-radius: 5px;
    padding: 0 6px;
    text-transform: uppercase;

    span {
      height: 22px;
      display: flex;
      align-items: center;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding: 4px;
      font-size: 11px;
      opacity: 0.5;
    }

    &:hover {
      span {
        opacity: 0.7;
        transition: opacity 0.2s;
      }
    }

    &:active {
      span {
        opacity: 0.8;
      }
    }

    &[aria-pressed="true"] {
      span {
        opacity: 1;
        border-bottom: 2px solid var(--primary-color);
      }
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
        <span>Pools</span>
      </button>
      <button
        onClick={onClick("queries")}
        aria-pressed={currentSectionName === "queries"}
      >
        <span>Queries</span>
      </button>
      {/*<button*/}
      {/*  onClick={onClick("history")}*/}
      {/*  aria-pressed={currentSectionName === "history"}*/}
      {/*>*/}
      {/*  <span>History</span>*/}
      {/*</button>*/}
    </BG>
  )
}
