import React, {useEffect, useRef, useState} from "react"
import Link from "src/js/components/common/Link"
import styled from "styled-components"
import InputLabel from "src/js/components/common/forms/InputLabel"
import TextInput from "src/js/components/common/forms/TextInput"
import {DropZone} from "src/components/drop-zone"
import {Field} from "src/components/field"
import {FileInput} from "src/components/file-input"
import SelectInput from "src/js/components/common/forms/SelectInput"
import {Help} from "src/components/help"
import {SubmitButton} from "src/components/submit-button"
import {Scrollable} from "src/components/scrollable"
import links from "src/app/core/links"
import {createAndLoadFiles} from "src/app/commands/pools"
import {useZuiApi} from "src/app/core/context"
import {FormError} from "src/components/form-error"
import {useHistory} from "react-router"
import {useFilesDrop} from "src/util/hooks/use-files-drop"
import {DropOverlay} from "src/app/features/sidebar/drop-overlay"
import {LoadFormat} from "packages/zealot/src"
import {DataFormatSelect} from "src/components/data-format-select"
import {H1} from "src/components/h1"

const BG = styled(Scrollable)`
  background-image: url(dist/static/welcome-page-background.svg);
  height: 100%;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  padding-top: 5vh;
  display: flex;
  flex-direction: column;
  position: relative;
  ${H1} {
    text-align: center;
    margin-bottom: 16px;
  }
`

const Form = styled.form`
  padding: 32px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background: white;
  box-shadow: 0 22px 80px hsla(0 0% 72% / 0.8);
  border-radius: 8px;
  border: 1px solid hsl(0 0% 85%);
`

const Footer = styled.footer`
  width: 400px;
  margin: 0 auto;
  padding: 0 32px;
  margin-top: 28px;
  margin-bottom: 16px;
  display: flex;
  flex-flow: column;
  gap: 12px;
`

const Drop = styled(DropZone)`
  display: flex;
  flex-direction: column;
  gap: 28px;
`

export function PoolNew() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const api = useZuiApi()
  const form = useRef(null)
  const history = useHistory()
  const defaults = history.location.state || {}
  const [files, setFiles] = useState<File[]>(defaults["files"] ?? [])

  function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form)
    return {
      ...(Object.fromEntries(formData.entries()) as {
        order?: "desc" | "asc"
        key?: string
        format?: LoadFormat
        name?: string
      }),
      files,
    }
  }

  useEffect(() => {
    const formEl = form.current
    return () => {
      const data = getFormData(formEl)
      history.location.state = data
    }
  }, [files])

  const [{isOver}, ref] = useFilesDrop({onDrop: setFiles})

  return (
    <BG ref={ref}>
      <H1>New Pool</H1>
      <Form
        ref={form}
        onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = getFormData(form)
          api.url.setState(formData)
          if (formData.files.length === 0 && !formData.name) {
            setError("Please select files or supply a pool name.")
            return
          }
          setLoading(true)
          const {name, order, key, format} = formData
          await createAndLoadFiles.run(files, {name, order, key, format})
          setLoading(false)
        }}
      >
        <Drop>
          <Field>
            <InputLabel htmlFor="files">Files</InputLabel>
            <FileInput
              multiple
              name="files"
              autoFocus
              files={files}
              setFiles={setFiles}
              onChange={(e) => {
                if (e.currentTarget.files.length > 0) setError("")
              }}
            />
          </Field>
          <Field>
            <InputLabel htmlFor="format">Format</InputLabel>
            <DataFormatSelect name="format" defaultValue={defaults["format"]} />
          </Field>
        </Drop>
        <Field>
          <InputLabel htmlFor="name">Pool Name</InputLabel>
          <TextInput
            name="name"
            placeholder="Derive from files..."
            defaultValue={defaults["name"]}
          />
        </Field>
        <Field>
          <InputLabel htmlFor="key">Pool Key</InputLabel>
          <TextInput
            name="key"
            placeholder="None"
            defaultValue={defaults["key"] ?? "ts"}
          />
        </Field>
        <Field>
          <InputLabel htmlFor="order">Sort Order</InputLabel>
          <SelectInput name="order" defaultValue={defaults["order"]}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </SelectInput>
        </Field>
        {error && <FormError>{error}</FormError>}
        <SubmitButton
          disabled={loading}
          style={{
            minWidth: "100%",
            marginTop: 12,
            alignSelf: "center",
          }}
        >
          {loading ? "Loading..." : "Create Pool"}
        </SubmitButton>
      </Form>
      <Footer>
        <Help>
          <b>Auto-detectable formats</b>:{" "}
          <Link href="https://arrow.apache.org/docs/format/Columnar.html#ipc-streaming-format">
            Arrow IPC Stream
          </Link>
          , <Link href="https://tools.ietf.org/html/rfc4180">CSV</Link>,{" "}
          <Link href="https://www.json.org/json-en.html">JSON</Link>,{" "}
          <Link href="http://ndjson.org/">NDJSON</Link>,{" "}
          <Link href="https://docs.zeek.org/en/current/log-formats.html#zeek-tsv-format-logs">
            Zeek
          </Link>
          , <Link href={links.ZED_DOCS_FORMATS_ZJSON}>ZJSON</Link>,{" "}
          <Link href={links.ZED_DOCS_FORMATS_ZNG}>ZNG</Link>, and{" "}
          <Link href={links.ZED_DOCS_FORMATS_ZSON}>ZSON</Link>.
        </Help>
        <Help>
          <b>Non-auto-detectable formats</b>: Line and{" "}
          <Link href="https://parquet.apache.org/">Parquet</Link>.
        </Help>
      </Footer>
      <DropOverlay show={isOver}>Drop to Set Files...</DropOverlay>
    </BG>
  )
}
