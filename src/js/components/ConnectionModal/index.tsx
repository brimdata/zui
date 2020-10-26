import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import MacSpinner from "../MacSpinner"
import TextContent from "../TextContent"
import FormErrors from "../Preferences/FormErrors"
import styled from "styled-components"
import ModalBox from "../ModalBox/ModalBox"
import Modal from "../../state/Modal"
import ConnectionForm from "./ConnectionForm"
import ConnectionDetail from "./ConnectionDetail"
import Current from "../../state/Current"

const StyledFormErrors = styled(FormErrors)`
  h4 {
    margin-bottom: 0.25rem;
  }
  ul {
    margin-top: 1rem;
    line-height: 1.5;
  }
  a {
    color: var(--red);
    cursor: pointer;
    text-decoration: underline;
  }
  p {
    margin: 0;
    ${(props) => props.theme.typography.labelSmall}
  }
`

const StyledModalBox = styled(ModalBox)`
  width: 400px;
  background: linear-gradient(to bottom, var(--snow) 50%, white);

  ${StyledFormErrors} {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }
`

const ConnectionModal = () => {
  const dispatch = useDispatch()
  const {mode} = useSelector(Modal.getArgs)
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const conn = useSelector(Current.getConnection)

  const editButton = {
    label: "Edit",
    click: () => dispatch(Modal.show("connection", {mode: "edit"}))
  }
  const cancelButton = {
    label: "Cancel",
    click: (closeModal) => {
      setErrors([])
      closeModal()
    }
  }
  const okButton = {label: "OK", click: (closeModal) => closeModal()}
  const saveButton = {
    label: isSubmitting ? "" : "Save",
    icon: isSubmitting ? <MacSpinner /> : null,
    click: () => setIsSubmitting(true),
    disabled: isSubmitting
  }

  const buttons =
    mode === "detail" ? [editButton, okButton] : [cancelButton, saveButton]

  const title = mode === "edit" ? "Edit Connection" : "New Connection"

  const withSubmit = (onSubmit: () => Promise<void>) => {
    onSubmit()
      .then(() => {
        dispatch(Modal.hide())
      })
      .catch((errs) => {
        setErrors(errs)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <StyledModalBox
      title={mode === "detail" ? "" : title}
      name="connection"
      buttons={buttons}
    >
      <TextContent>
        {mode === "detail" ? (
          <ConnectionDetail conn={conn} />
        ) : (
          <>
            <StyledFormErrors errors={errors} />
            <ConnectionForm
              isSubmitting={isSubmitting}
              withSubmit={withSubmit}
              conn={mode === "edit" && conn}
            />
          </>
        )}
      </TextContent>
    </StyledModalBox>
  )
}

export default ConnectionModal
