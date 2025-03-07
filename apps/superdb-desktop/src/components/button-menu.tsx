import classNames from "classnames"
import React, {useMemo} from "react"
import {MenuItem} from "src/core/menu"
import styled from "styled-components"
import {IconButton} from "./icon-button"
import {MoreItemsButton} from "./more-items-button"
import {useResponsiveMenu} from "src/js/components/hooks/use-responsive-menu"

const BG = styled.menu`
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 0;
  min-width: 0;
  width: 100%;
  overflow: hidden;

  .button-menu__button--hidden {
    visibility: hidden;
    display: none;
  }
`

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  min-width: 0;
`

export function ButtonMenu(props: {
  label: string
  items: MenuItem[]
  justify?: "flex-start" | "flex-end" | "center"
}) {
  const items = useMemo(
    () => props.items.filter((i) => i.visible !== false),
    [props.items]
  )
  const menu = useResponsiveMenu(items)

  const buttons = menu.items.map((item: MenuItem, i: number) => {
    if (item.whenResult === false) return null
    return (
      <IconButton
        {...item}
        key={i}
        className={classNames({
          "button-menu__button--hidden": menu.isHidden(item),
        })}
      />
    )
  })
  const style = {justifyContent: props.justify ?? "flex-end"}
  return (
    <BG aria-label={props.label} ref={menu.containerRef} style={style}>
      <Buttons>
        {buttons}
        {menu.hasHiddenItems ? (
          <MoreItemsButton items={menu.hiddenItems} ref={menu.moreRef} />
        ) : null}
      </Buttons>
    </BG>
  )
}
