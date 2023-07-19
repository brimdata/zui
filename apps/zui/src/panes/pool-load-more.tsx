import React from "react"
import {LoadFormat} from "@brimdata/zed-js"
import {transparentize} from "polished"
import {forwardRef, useImperativeHandle, useState} from "react"
import {loadFiles} from "src/app/commands/pools"
import {Pool} from "src/app/core/pools/pool"
import {DataFormatSelect} from "src/components/data-format-select"
import {DropZone} from "src/components/drop-zone"
import {Field} from "src/components/field"
import {FileInput} from "src/components/file-input"
import InputLabel from "src/js/components/common/forms/InputLabel"
import styled from "styled-components"
import {cssVar} from "src/js/lib/cssVar"

const Drop = styled(DropZone)`
  background-color: ${transparentize(
    0.98,
    cssVar("--foreground-color") as string
  )};
  border: 2px dashed
    ${transparentize(0.5, cssVar("--foreground-color") as string)};
  padding: var(--page-padding);
  display: flex;
  flex-direction: column;
  gap: 32px;

  ${Field} {
    max-width: 300px;
  }
`

const BG = styled.section`
  margin: var(--page-padding);
  display: flex;
  flex-flow: column;
  gap: 10px;
`

type Props = {pool: Pool}
export type PoolLoadMoreHandle = {submit: (files: File[]) => void}

export const PoolLoadMore = forwardRef<PoolLoadMoreHandle, Props>(
  function PoolLoadMore(props, ref) {
    const [files, setFiles] = useState<File[]>([])
    const [format, setFormat] = useState<LoadFormat>("auto")
    const submit = (files: File[]) =>
      loadFiles.run(
        props.pool.id,
        files.map((f) => f.path),
        format
      )

    useImperativeHandle(ref, () => ({submit}))

    return (
      <BG>
        <h3>Load More Data</h3>
        <Drop>
          <Field>
            <InputLabel htmlFor="files">Files</InputLabel>
            <FileInput
              multiple
              name="files"
              autoFocus
              files={files}
              setFiles={setFiles}
              onChange={(e) => submit(Array.from(e.currentTarget.files))}
            />
          </Field>
          <Field>
            <InputLabel htmlFor="format">Format</InputLabel>
            <DataFormatSelect
              name="format"
              value={format}
              onChange={(e) => {
                setFormat(e.currentTarget.value as LoadFormat)
              }}
            />
          </Field>
        </Drop>
      </BG>
    )
  }
)
