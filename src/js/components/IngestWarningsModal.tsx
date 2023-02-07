import React from "react"
import {useDispatch, useSelector} from "react-redux"
import ToolbarButton from "src/app/query-home/toolbar/actions/button"
import Current from "../state/Current"
import Pools from "../state/Pools"
import useEnterKey from "./hooks/useEnterKey"
import {
  ButtonGroup,
  Content,
  Footer,
  Pre,
  Scrollable,
  Title,
} from "./ModalDialog/ModalDialog"

export default function IngestWarningsModal({onClose}) {
  const dispatch = useDispatch()
  useEnterKey(onClose)
  const lakeId = useSelector(Current.getLakeId)
  const poolId = useSelector(Current.getPoolId)
  const warnings = useSelector(Pools.getWarnings(lakeId, poolId))
  if (!warnings) return null

  const onClear = () => {
    dispatch(Pools.clearWarnings({lakeId, poolId}))
    onClose()
  }

  return (
    <Content width={800}>
      <Title>Ingest Warnings</Title>
      {warnings.length ? (
        <>
          <p>
            {
              "The data you've attempted to import was not recognized as any supported packet capture or log format. The errors returned by each log parser:"
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
