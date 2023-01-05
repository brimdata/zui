import React from "react"
import {columnListItemMenu} from "src/app/menus/column-list-item-menu"
import {ListItem} from "src/components/list-item"
import {ZedColumn} from "src/components/zed-table/column"
import {NodeRendererProps, Tree} from "react-arborist"
import {useResultsContext} from "src/app/query-home"
import {FillFlexParent} from "src/components/fill-flex-parent"
import classNames from "classnames"

function Node(props: NodeRendererProps<ZedColumn>) {
  const {node} = props
  const column = node.data
  const menu = columnListItemMenu.build(column)
  return (
    <ListItem
      innerRef={props.dragHandle}
      indent={node.level}
      isOpen={node.isOpen}
      canToggle={column.isRecordType}
      onToggle={() => props.node.toggle()}
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
  const {table} = useResultsContext()
  if (!table) return <p>Columns are for the table view</p>
  return (
    <FillFlexParent>
      {({width, height}) => {
        return (
          <Tree
            className="columns-tree"
            rowHeight={28}
            width={width}
            height={height}
            initialData={table.baseColumns}
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
