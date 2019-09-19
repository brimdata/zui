/* @flow */
import {useDispatch, useSelector} from "react-redux"
import Prism from "prismjs"
import React, {useEffect, useState} from "react"

import {Input, InputSubmit} from "./form/Inputs"
import {getDebugModalIsOpen} from "../state/reducers/view"
import {getSearchProgram} from "../state/selectors/searchBar"
import {hideModal} from "../state/actions"
import ButtonRow from "./ButtonRow"
import Form from "./form/Form"
import Modal from "./Modal"
import TextContent from "./TextContent"
import brim from "../brim"

export function DebugModal() {
  let dispatch = useDispatch()
  let isOpen = useSelector(getDebugModalIsOpen)
  let onClose = () => dispatch(hideModal())
  let searchProgram = useSelector(getSearchProgram)
  let [program, setProgram] = useState(searchProgram)

  let ast, error
  try {
    ast = brim.program(program).ast()
  } catch (e) {
    error = e
  }

  let result
  if (ast) {
    result = Prism.highlight(
      JSON.stringify(ast, null, 4),
      Prism.languages.js,
      "JSON"
    )
  } else if (error) {
    result = error.toString()
  }

  function onKeyPress(e) {
    if (!isOpen) return
    if (e.key === "Enter") {
      onClose()
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress, false)
    return () => {
      document.removeEventListener("keypress", onKeyPress, false)
    }
  }, [])

  return (
    <Modal title="Debug Query" isOpen={isOpen} onClose={onClose}>
      <div className="debug-query-modal">
        <TextContent>
          <p>
            Type a query in the text box to see the parsed abstract syntax tree
            (AST).
          </p>

          <Form>
            <Input
              label="Query"
              className="mono"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            />
          </Form>

          <pre
            className="language-js"
            dangerouslySetInnerHTML={{__html: result}}
          />
        </TextContent>
        <ButtonRow>
          <InputSubmit value="Done" onClick={onClose} />
        </ButtonRow>
      </div>
    </Modal>
  )
}
