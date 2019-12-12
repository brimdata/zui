/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"

import {changeSearchBarInput} from "../state/actions"
import {getSearchBarInputValue} from "../state/selectors/searchBar"
import {getViewerStatus} from "../state/viewer/selector"
import {killSearchesByTag} from "../searches/cancelSearch"
import {reactElementProps} from "../test/integration"
import Animate from "./Animate"
import InputHistory from "../models/InputHistory"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import ThreeDotButton from "./ThreeDotButton"
import modal from "../state/modal"
import search from "../state/search"
import submitSearch from "../flows/submitSearch"

export default function SearchInput() {
  let dispatch = useDispatch()
  let history = useRef(new InputHistory<string>())
  let inputValue = useSelector(getSearchBarInputValue)

  function changeTo(value: string) {
    dispatch(changeSearchBarInput(value))
  }

  function submit() {
    dispatch(submitSearch())
  }

  function onChange(e) {
    changeTo(e.currentTarget.value)
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submit()
      history.current.push(e.currentTarget.value)
    }
    if (e.key === "ArrowUp") {
      history.current.goBack()
      changeTo(history.current.getCurrentEntry())
    }
    if (e.key === "ArrowDown") {
      history.current.goForward()
      changeTo(history.current.getCurrentEntry())
    }
  }

  return (
    <div className="search-input">
      <input
        id="main-search-input"
        type="text"
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoFocus={true}
        autoComplete="off"
        {...reactElementProps("search_input")}
      />
      <ActionButton />
      <Menu />
    </div>
  )
}

function Menu() {
  let dispatch = useDispatch()
  let isFetching = useSelector(getViewerStatus) === "FETCHING"

  let menu = [
    {label: "Debug query", click: () => dispatch(modal.show("debug"))},
    {label: "Copy for curl", click: () => dispatch(modal.show("curl"))},
    {label: "Copy for boom get", click: () => dispatch(modal.show("boom-get"))},
    {
      label: "Kill search",
      click: () => dispatch(killSearchesByTag("viewer")),
      disabled: !isFetching
    }
  ]

  return (
    <PopMenuPointy template={menu} {...reactElementProps("optionsMenu")}>
      <ThreeDotButton {...reactElementProps("optionsButton")} />
    </PopMenuPointy>
  )
}

function ActionButton() {
  let next = useSelector(search.getSpanArgs)
  let prev = useSelector(search.getPrevSpanArgs)
  let show = !isEqual(next, prev)
  let dispatch = useDispatch()
  let onClick = () => dispatch(submitSearch())

  let enter = (anime, el) => {
    return anime
      .timeline({easing: "easeOutSine", duration: 100})
      .add({
        targets: el,
        scaleY: [0, 1],
        opacity: [0, 1]
      })
      .add(
        {
          targets: el.querySelectorAll("span"),
          opacity: [0, 1],
          delay: anime.stagger(50)
        },
        50
      )
  }

  return (
    <Animate show={show} enter={enter}>
      <button className="input-action" onClick={onClick}>
        <span>R</span>
        <span>u</span>
        <span>n</span>
      </button>
    </Animate>
  )
}
