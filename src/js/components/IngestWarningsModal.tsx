import {useSelector} from "react-redux"
import React from "react"

import {JSON_TYPE_CONFIG_DOCS} from "./Preferences/JSONTypeConfig"
import {globalDispatch} from "../state/GlobalContext"
import Current from "../state/Current"
import Link from "./common/Link"
import Spaces from "../state/Spaces"
import useEnterKey from "./hooks/useEnterKey"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "./Toolbar/Button"

export default function IngestWarningsModal({onClose}) {
  useEnterKey(onClose)
  const id = useSelector(Current.getConnectionId)
  const spaceId = useSelector(Current.getSpaceId)
  const warnings = useSelector(Spaces.getIngestWarnings(id, spaceId))
  const onClear = () => globalDispatch(Spaces.clearIngestWarnings(id, spaceId))

  return (
    <Content width={800}>
      <Title>Ingest Warnings</Title>
      {warnings.length ? (
        <>
          <p>
            If you are trying to import JSON logs, please review the{" "}
            <Link href={JSON_TYPE_CONFIG_DOCS}>
              JSON type configuration docs.
            </Link>
          </p>
          <Scrollable>
            <Pre>{warnings.join("\n")}</Pre>
          </Scrollable>
        </>
      ) : (
        <p>Warnings cleared.</p>
      )}
      <Footer>
        <ButtonGroup>
          {warnings.length > 0 && (
            <ToolbarButton text="Clear Warnings" onClick={onClear} />
          )}
          <ToolbarButton text="Done" onClick={onClose} />
        </ButtonGroup>
      </Footer>
    </Content>
  )
}
