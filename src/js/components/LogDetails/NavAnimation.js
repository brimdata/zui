/* @flow */

import {CSSTransition, TransitionGroup} from "react-transition-group"
import React from "react"
import classNames from "classnames"

import Log from "../../models/Log"

type Props = {log: Log, prev: boolean, children: *}

const NavAnimation = ({log, prev, children}: Props) => (
  <TransitionGroup
    className={classNames("log-detail-wrapper", {
      prev
    })}
  >
    <CSSTransition
      key={log.id()}
      classNames="log-detail"
      timeout={{
        enter: 250,
        exit: 250
      }}
    >
      {children}
    </CSSTransition>
  </TransitionGroup>
)

export default NavAnimation
