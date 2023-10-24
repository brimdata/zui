import React from "react"
import {ButtonMenu} from "src/components/button-menu"
import {Toolbar} from "src/components/toolbar"
import {ResultsViewSwitch} from "./results-view-switch"
import {useMenuInstance} from "src/core/menu/use-menu-instance"
import styles from "../query-home.module.css"

export function ResultsToolbar() {
  const menu = useMenuInstance("results.toolbarMenu")
  return (
    <Toolbar className={styles.resultsToolbar}>
      <ResultsViewSwitch />
      <ButtonMenu items={menu.items} label={menu.label} />
    </Toolbar>
  )
}
