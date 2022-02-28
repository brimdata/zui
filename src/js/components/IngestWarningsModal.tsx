import React from "react"
import {useDispatch, useSelector} from "react-redux"
import ToolbarButton from "src/app/toolbar/button"
import Current from "../state/Current"
import Ingests from "../state/Ingests"
import useEnterKey from "./hooks/useEnterKey"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title
} from "./ModalDialog/ModalDialog"

export default function IngestWarningsModal({onClose}) {
  const dispatch = useDispatch()
  useEnterKey(onClose)
  const poolId = useSelector(Current.getPoolId)
  const ingest = useSelector(Ingests.get(poolId))
  if (!ingest) return null
  const warnings = ingest.warnings
  const onClear = () => dispatch(Ingests.remove(poolId))

  return (
    <Content width={800}>
      <Title>Ingest Warnings</Title>
      {warnings.length ? (
        <>
          <p>
            {
              "The data you've attempt to import was not recognized as any supported packet capture or log format. The errors returned by each log parser:"
            }
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
