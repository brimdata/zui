import React from "react"
import {useDispatch, useSelector} from "react-redux"
import ToolbarButton from "src/app/query-home/toolbar/actions/button"
import Current from "../state/Current"
import Loads from "../state/Loads"
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
  const poolId = useSelector(Current.getPoolId)
  const loads = useSelector((state) => Loads.wherePoolId(state, poolId))
  if (!loads.length) return null
  const warnings = loads.flatMap((l) => l.warnings)
  const onClear = () => dispatch(Loads.delete(loads))

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
