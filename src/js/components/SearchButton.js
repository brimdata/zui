/* @flow */

import {connect} from "react-redux"
import React from "react"

import {DebugModal} from "./DebugModal"
import type {DispatchProps} from "../state/types"
import {XSearchButtonMenu} from "./SearchButtonMenu"
import {reactElementProps} from "../test/integration"
import {submitSearchBar} from "../state/thunks/searchBar"
import Arrow from "../icons/caret-bottom-sm.svg"
import CurlModal from "./CurlModal"
import DropMenu from "./DropMenu"
import MagGlass from "../icons/magnifying-glass-md.svg"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  debugModalIsOpen: boolean,
  curlModalIsOpen: boolean
|}

type Props = {|
  ...StateProps,
  ...DispatchProps
|}

export default class SearchButton extends React.Component<Props> {
  render() {
    return (
      <div className="search-button-wrapper">
        <button
          className="button search-button"
          {...reactElementProps("search_button")}
          onClick={() => this.props.dispatch(submitSearchBar())}
        >
          <MagGlass />
        </button>

        <DropMenu menu={XSearchButtonMenu} position="right">
          <button className="button options-button">
            <Arrow />
          </button>
        </DropMenu>

        <DebugModal />

        <CurlModal />
      </div>
    )
  }
}

export const XSearchButton = connect<Props, {||}, _, _, _, _>(
  null,
  dispatchToProps
)(SearchButton)
