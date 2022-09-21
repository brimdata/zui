import React, {useState} from "react"
import {Content, Title} from "../ModalDialog/ModalDialog"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import Pools from "../../state/Pools"
import ToolbarButton from "src/app/query-home/toolbar/actions/button"
import styled from "styled-components"
import StatusLight from "./StatusLight"
import EditLakeModal from "./EditLakeModal"
import useEnterKey from "../hooks/useEnterKey"
import LakeStatuses from "../../state/LakeStatuses"
import * as remote from "@electron/remote"
import Link from "../common/Link"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"
import removeLake from "../../flows/lake/removeLake"
import {useDispatch} from "src/app/core/state"

const StyledContent = styled(Content)`
  padding-top: 24px;
  min-width: 360px;
  width: 100%;
`

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-bottom: 12px;

  button {
    margin-left: 12px;
  }

  a {
    margin-right: auto;
    color: var(--red);
  }
`

const StyledLakeDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const LakeFields = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.75);
  flex-direction: column;
  border-radius: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 24px;
  width: 100%;
`

const FieldWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  margin-left: 12px;
  height: 30px;
  position: relative;

  &:last-child:after {
    display: none;
  }

  &:after {
    width: 100%;
    height: 1px;
    box-shadow: 0 0.5px 0 var(--aqua);
    opacity: 0.1;
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
  }

  label {
    ${(p) => p.theme.typography.labelNormal}
  }

  p {
    color: var(--slate);
    ${(p) => p.theme.typography.labelNormal};
    margin: 0;
  }
`

const Status = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  p {
    text-transform: capitalize;
    margin: 0 0 0 6px;
  }
`

type FieldProps = {
  label: string
  value: string
}

const Field = ({label, value}: FieldProps) => {
  return (
    <FieldWrapper>
      <label>{label}</label>
      <p>{value}</p>
    </FieldWrapper>
  )
}

const ViewLake = ({onClose, onEdit}) => {
  const dispatch = useDispatch()
  const lake = useSelector(Current.getLake)
  const lakeId = lake ? lake.id : null
  const poolIds = useSelector(Pools.ids(lakeId))
  const wsStatus = useSelector(LakeStatuses.get(lakeId))

  useEnterKey(onClose)

  if (!lake) return null

  const isDefault = lake.id === "localhost:9867"

  const poolCount = poolIds.length
  const {name, host, port, version = "unknown"} = lake

  const onRemove = () => {
    remote.dialog
      .showMessageBox({
        type: "warning",
        title: "Lake Logout",
        message: `Are you sure you want to log out of ${name}?`,
        buttons: ["OK", "Cancel"],
      })
      .then(({response}) => {
        if (response === 0) {
          onClose()
          try {
            dispatch(removeLake(lake))
          } catch (e) {
            dispatch(Notice.set(ErrorFactory.create(e)))
          }
        }
      })
  }

  return (
    <StyledContent>
      <StyledLakeDetail>
        <Title>{name}</Title>
        <Status>
          <StatusLight status={wsStatus} />
          <p>{wsStatus || "unknown"}</p>
        </Status>
        <LakeFields>
          <Field
            label="Lake URL"
            value={port ? [host, port].join(":") : host}
          />
          <Field label="Zed Version" value={version} />
          <Field label="Pools" value={`${poolCount}`} />
        </LakeFields>
      </StyledLakeDetail>
      <StyledFooter>
        <ToolbarButton text="OK" onClick={onClose} />
        <ToolbarButton text="Edit" onClick={onEdit} />
        {!isDefault && <Link onClick={onRemove}>Logout</Link>}
      </StyledFooter>
    </StyledContent>
  )
}

const ViewLakeModal = ({onClose}) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <EditLakeModal onClose={() => setEditing(false)} />
  } else {
    return <ViewLake onClose={onClose} onEdit={() => setEditing(true)} />
  }
}

export default ViewLakeModal
