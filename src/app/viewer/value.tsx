import {zedTypeClassName} from "src/app/core/utils/zed-type-class-name"
import {transparentize} from "polished"
import searchFieldContextMenu from "src/ppl/menus/searchFieldContextMenu"
import {isEventType, SuricataEventType} from "src/ppl/suricata/suricata-plugin"
import {isPath, ZeekPath} from "src/ppl/zeek/zeek-plugin"
import React, {Fragment} from "react"
import {useDispatch} from "src/app/core/state"
import {cssVar} from "src/js/lib/cssVar"
import styled from "styled-components"
import {zed} from "@brimdata/zealot"
import {useZedFormatter} from "../core/format"

const havelock = cssVar("--havelock")
const transHavelock = transparentize(0.75, havelock as string)

const BG = styled.span`
  cursor: default;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  align-items: center;
  min-width: 7px;
  &:hover {
    background: ${transHavelock};
    border-radius: 4px;
  }
`
const Syntax = styled.span`
  color: var(--lead);
`

type ValueProps = {
  field: zed.Field
  value: zed.Value
  record: zed.Record
  padBefore?: boolean
  padAfter?: boolean
  displayConfig: object
}

const Space = styled.span`
  display: inline-block;
  width: 7px;
  height: 100%;
`
const pad = (bool) => (bool ? <Space /> : null)

export default function Value(props: ValueProps) {
  if (props.value.isUnset()) {
    return <PrimitiveValue {...props} />
  } else if (props.value instanceof zed.Set) {
    return <SetValue {...props} />
  } else if (props.value instanceof zed.Array) {
    return <ArrayValue {...props} />
  } else if (props.value instanceof zed.Error) {
    return <ErrorValue {...props} />
  } else {
    return <PrimitiveValue {...props} />
  }
}

export function PrimitiveValue(props: ValueProps) {
  const dispatch = useDispatch()
  const format = useZedFormatter()
  return (
    <BG
      role="cell"
      className={zedTypeClassName(props.value)}
      onContextMenu={() =>
        dispatch(
          searchFieldContextMenu({
            field: props.field,
            record: props.record,
            value: props.value,
          })
        )
      }
    >
      {pad(props.padBefore)}
      {renderValue(props, format)}
      {pad(props.padAfter)}
    </BG>
  )
}

function renderValue(props, format) {
  if (isPath(props.field.name, props.field.value))
    return <ZeekPath {...props} />
  if (isEventType(props.field.name, props.field.value))
    return <SuricataEventType {...props} />

  return format(props.value as zed.Primitive)
}

export function SetValue(props: ValueProps) {
  const set = props.value as zed.Set
  const lastItem = (i) => i === set.items.length - 1
  const firstItem = (i) => i === 0
  return (
    <>
      <Syntax>|[</Syntax>
      {set.items.map((v, i) => (
        <Fragment key={i}>
          <Value
            {...props}
            value={v}
            padAfter={false}
            padBefore={!firstItem(i)}
          />
          {lastItem(i) ? null : <Syntax key={i + ","}>,</Syntax>}
        </Fragment>
      ))}
      <Syntax>]|</Syntax>
      {pad(props.padBefore)}
    </>
  )
}

export function ArrayValue(props: ValueProps) {
  const array = props.value as zed.Array
  const lastItem = (i) => i === array.items.length - 1
  const firstItem = (i) => i === 0
  return (
    <>
      <Syntax>[</Syntax>
      {array.items.map((v, i) => (
        <Fragment key={i}>
          <Value
            {...props}
            value={v}
            padAfter={false}
            padBefore={!firstItem(i)}
          />
          {lastItem(i) ? null : <Syntax key={i + ","}>,</Syntax>}
        </Fragment>
      ))}
      <Syntax>]</Syntax>
      {pad(props.padBefore)}
    </>
  )
}

export function ErrorValue(props: ValueProps) {
  const error = props.value as zed.Error
  return (
    <>
      <span className="zed-error">Error</span>
      <Syntax>(</Syntax>
      <Value
        {...props}
        value={error.value}
        padAfter={false}
        padBefore={false}
      />
      <Syntax>)</Syntax>
      {pad(props.padBefore)}
    </>
  )
}
