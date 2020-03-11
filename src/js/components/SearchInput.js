/* @flow */

import {isEqual} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"

import {reactElementProps} from "../test/integration"
import Animate from "./Animate"
import Handlers from "../state/Handlers"
import InputHistory from "../models/InputHistory"
import Modal from "../state/Modal"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import ThreeDotButton from "./ThreeDotButton"
import submitSearch from "../flows/submitSearch"

export default function SearchInput() {
  let dispatch = useDispatch()
  let history = useRef(new InputHistory<string>())
  let inputValue = useSelector(SearchBar.getSearchBarInputValue)

  function changeTo(value: string) {
    dispatch(SearchBar.changeSearchBarInput(value))
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
        className="mousetrap"
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
  let isFetching = useSelector(Tab.isFetching)

  let menu = [
    {label: "Debug query", click: () => dispatch(Modal.show("debug"))},
    {label: "Copy for curl", click: () => dispatch(Modal.show("curl"))},
    {label: "Copy for zq", click: () => dispatch(Modal.show("zq"))},
    {
      label: "Kill search",
      click: () => dispatch(Handlers.abortAll()),
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
  let next = useSelector(Search.getRecord)
  let prev = useSelector(Tab.currentEntry)
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
