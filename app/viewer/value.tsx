import {useZedFormatter} from "app/core/format"
import Icon from "app/core/Icon"
import {typeClassNames} from "app/core/utils/type-class-names"
import {transparentize} from "polished"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import {isEventType, SuricataEventType} from "ppl/suricata/suricata-plugin"
import {isPath, ZeekPath} from "ppl/zeek/zeek-plugin"
import React, {Fragment} from "react"
import {useDispatch} from "react-redux"
import {cssVar} from "src/js/lib/cssVar"
import styled from "styled-components"
import {zed} from "zealot"

const havelock = cssVar("--havelock")
const transHavelock = transparentize(0.75, havelock as string)

const BG = styled.span`
  cursor: default;
  display: flex;
  height: 100%;
  align-items: center;
  min-width: 7px;
  &:hover {
    background: ${transHavelock};
    border-radius: 4px;
  }
`
const Syntax = styled.span`
  color: var(--cloudy);
`

type ValueProps = {
  field: zed.Field
  value: zed.AnyValue
  record: zed.Record
  padBefore?: boolean
  padAfter?: boolean
  displayConfig: object
}

const Space = styled.span`
  display: inline-block;
  width: 7px;
`
const pad = (bool) => (bool ? <Space /> : null)

export default function Value(props: ValueProps) {
  if (props.value.isUnset()) {
    return <PrimitiveValue {...props} />
  } else if (props.value instanceof zed.Set) {
    return <SetValue {...props} />
  } else if (props.value instanceof zed.Array) {
    return <ArrayValue {...props} />
  } else {
    return <PrimitiveValue {...props} />
  }
}

export function PrimitiveValue(props: ValueProps) {
  const dispatch = useDispatch()
  const format = useZedFormatter()
  const fillCell = props.field.value === props.value // This is the only value in the cell
  return (
    <BG
      style={{width: fillCell ? "100%" : "auto"}}
      className={typeClassNames(props.value)}
      onContextMenu={() =>
        dispatch(
          searchFieldContextMenu({
            field: props.field,
            record: props.record,
            value: props.value
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

const StyledErrorField = styled.div`
  display: inline-flex;
  background-color: var(--alert-1);
  border-radius: 3px;
  color: white;
  height: 17px;
  justify-content: center;
  align-items: center;
  padding: 0 9px;

  svg {
    margin-right: 8px;
    margin-top: 1px;
    fill: white;
    opacity: 0.6;
    width: 11px;
    height: 11px;
  }
`

const ErrorField = (props) => {
  return (
    <StyledErrorField>
      <Icon name="warning" />
      <span>{props.field.value.toString()}</span>
    </StyledErrorField>
  )
}

function renderValue(props, format) {
  if (props.field?.data instanceof zed.Error) return <ErrorField {...props} />
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
