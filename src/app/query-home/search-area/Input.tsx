import React from "react"
import styled from "styled-components"
import QueryEditor from "./editor/query-editor"
import {useDispatch} from "../../core/state"
import useDrag, {DragArgs} from "src/app/core/hooks/use-drag"
import Editor from "../../../js/state/Editor"
import {useSelector} from "react-redux"
import lib from "src/js/lib"

const DragAnchor = styled.div`
  position: absolute;
  background: transparent;
  pointer-events: all !important;
  z-index: 99;
  width: 100%;
  height: 16px;
  bottom: -8px;
  top: unset;
  cursor: row-resize;
`

const InputBackdrop = styled.div<{height: number}>`
  border-bottom: 1px solid var(--border-color);
  position: relative;
  height: ${(p) => p.height + "px"};
`

type Props = {
  value: string
  disabled?: boolean
}

export default function Input({value, disabled}: Props) {
  const dispatch = useDispatch()
  const height = useSelector(Editor.getHeight)

  const onDrag = ({dy}: DragArgs) => {
    const minH = 54
    const maxH = lib.win.getHeight() - 400
    const newHeight = height + dy
    dispatch(Editor.setHeight(Math.max(Math.min(newHeight, maxH), minH)))
  }
  const bindDrag = useDrag(onDrag)

  return (
    <InputBackdrop height={height}>
      <QueryEditor value={value} disabled={disabled} />
      <DragAnchor onMouseDown={bindDrag} />
    </InputBackdrop>
  )
}
