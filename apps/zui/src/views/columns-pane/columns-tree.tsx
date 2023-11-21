import React from "react"
import {columnListItemMenu} from "src/app/menus/column-list-item-menu"
import {ListItem} from "src/components/list-item"
import {NodeRendererProps, Tree} from "react-arborist"
import {FillFlexParent} from "src/components/fill-flex-parent"
import classNames from "classnames"
import {EmptyText} from "src/app/features/right-pane/common"
import {useSelector} from "react-redux"
import Table from "src/js/state/Table"
import {TableColumn} from "src/js/state/Table/selectors"
import {collapseColumn, expandColumn} from "src/domain/results/handlers"

function Node(props: NodeRendererProps<TableColumn>) {
  const {node} = props
  const column = node.data
  const menu = columnListItemMenu.build(column)

  return (
    <ListItem
      className={classNames({"columns-tree__item--hidden": !column.isVisible})}
      innerRef={props.dragHandle}
      indent={node.level}
      isOpen={node.isOpen}
      canToggle={column.children != null}
      onToggle={() => {
        node.isOpen ? collapseColumn(column.id) : expandColumn(column.id)
        node.toggle()
      }}
      menu={menu}
    >
      {column.name}
      <code
        className={classNames("columns-tree__type", getClassName(column.type))}
      >
        {"<" + getType(column.type) + ">"}
      </code>
    </ListItem>
  )
}

export function ColumnsTree() {
  const columns = useSelector(Table.getNestedColumns)
  const openState = useSelector(Table.getColumnExpanded)
  if (columns.length == 0)
    return <EmptyText>Only available when results are in Table view.</EmptyText>

  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <Tree
            className="columns-tree"
            rowHeight={28}
            width={width}
            height={height}
            data={columns}
            openByDefault={false}
            initialOpenState={openState}
            disableDrag
            disableDrop
            padding={10}
          >
            {Node}
          </Tree>
        )
      }}
    </FillFlexParent>
  )
}

function getClassName(type) {
  if (type.kind === "primitive") return "zed-" + type.name
  else return "zed-container"
}

function getType(type) {
  if (type.kind === "primitive") return type.name
  else return type.kind
}
