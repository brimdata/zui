import {zed} from "@brimdata/zealot"
import Icon from "app/core/Icon"
import {zedTypeClassName} from "app/core/utils/zed-type-class-name"
import classNames from "classnames"
import React, {ReactNode} from "react"
import {InspectArgs} from "./types"

export function renderOneField(args: InspectArgs) {
  let nodes = []
  if (args.key) {
    nodes.push(
      <span className="zed-key" key={args.key.toString()}>
        {typeof args.key === "string"
          ? args.key
          : renderOneValue({...args, value: args.key})}
        :{" "}
      </span>
    )
  }
  nodes.push(renderOneValue(args))
  nodes.push(renderAlias(args.type))
  if (!args.last) nodes.push(", ")
  return nodes
}

export function renderAlias(type: zed.Type) {
  // @ts-ignore
  if (type && zed.isTypeAlias(type)) {
    return [
      <span key="alias-1" className="zed-syntax">
        {" "}
        (
      </span>,
      <span key="alias-2" className="zed-annotation">
        {type.name}
      </span>,
      <span key="alias-3" className="zed-syntax">
        )
      </span>
    ]
  } else {
    return null
  }
}

export function renderOneValue(args: InspectArgs): ReactNode {
  const {ctx, value, field} = args

  const props = {
    key: field?.name + value.toString(),
    className: zedTypeClassName(value),
    onContextMenu: (e: React.MouseEvent) => {
      throw new Error("Implement Me Soon")
      //ctx.onContextMenu(e, value, field)
    }
  }

  if (zed.isType(value)) {
    if (zed.isPrimitiveType(value)) {
      return <span {...props}>{value.toString()}</span>
    } else if (value instanceof zed.TypeRecord) {
      return (
        <>
          <span {...props}>{`Record(${value.fields.length})`}</span>
          {renderAlias(args.type)}
        </>
      )
    } else if (value instanceof zed.TypeAlias) {
      return (
        <span {...props}>
          {renderOneValue({...args, value: value.type, type: value})}
        </span>
      )
    } else if (value instanceof zed.TypeArray) {
      return (
        <span {...props}>[{renderOneValue({...args, value: value.type})}]</span>
      )
    } else if (value instanceof zed.TypeSet) {
      return (
        <span {...props}>
          {"|["}
          {renderOneValue({...args, value: value.type})}
          {"]|"}
        </span>
      )
    } else if (value instanceof zed.TypeMap) {
      return (
        <span {...props}>
          {"|{"}
          {renderOneValue({...args, value: value.keyType})}
          {": "}
          {renderOneValue({...args, value: value.valType})}
          {"}|"}
        </span>
      )
    } else if (value instanceof zed.TypeUnion) {
      return <span {...props}>{`Union(${value.types.length})`}</span>
    } else {
      return null
    }
  }

  if (value.isUnset()) {
    return <span {...props}>{value.toString()}</span>
  }

  if (value instanceof zed.Record) {
    return <span {...props}>{`Record(${value.fields.length})`}</span>
  }

  if (value instanceof zed.Array) {
    return <span {...props}>{`Array(${value.items.length})`}</span>
  }

  if (value instanceof zed.Set) {
    return <span {...props}>{`Set(${value.items.length})`}</span>
  }

  if (value instanceof zed.Map) {
    return <span {...props}>{`Map(${value.value.size})`}</span>
  }

  if (zed.isStringy(value)) {
    return <span {...props}>&quot;{value.toString()}&quot;</span>
  }

  if (value instanceof zed.Union) {
    return renderOneValue({...args, value: value.value})
  }

  if (value instanceof zed.TypeValue) {
    return renderOneValue({...args, value: value.value})
  }

  return <span {...props}>{value.toString()}</span>
}

export function renderContainer(
  args: InspectArgs,
  container: string,
  openToken: string,
  nodes: ReactNode = null,
  closeToken: string = null
) {
  const {ctx, value, key} = args
  const isExpanded = ctx.isExpanded(value)
  const row = []
  if (key) {
    row.push(
      <span key={"field-" + key} className="zed-key">
        {key}:{" "}
      </span>
    )
  }
  row.push(
    <a
      key="handle"
      onClick={() => ctx.setExpanded({args, isExpanded: !isExpanded})}
    >
      <Icon
        name={isExpanded ? "chevron-down" : "chevron-right"}
        key="arrow"
        size={16}
      />

      <span
        key="name"
        className={classNames("zed-container", {
          "zed-type": zed.isType(args.value)
        })}
      >
        {container}{" "}
      </span>

      {openToken ? (
        <span key="open-token" className="zed-syntax">
          {openToken}
        </span>
      ) : null}

      {nodes}

      {closeToken ? (
        <span key="close-token" className="zed-syntax">
          {closeToken}
        </span>
      ) : null}

      {closeToken && renderAlias(args.type)}
    </a>
  )
  return row
}

export function renderClosing(args: InspectArgs, syntax: string) {
  return [
    <span key="close" className="zed-syntax">
      {syntax}
    </span>,

    renderAlias(args.type),

    args.last ? null : ","
  ]
}
