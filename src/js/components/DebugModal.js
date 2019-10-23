/* @flow */
import {useSelector} from "react-redux"
import Prism from "prismjs"
import React, {useState} from "react"

import {Input} from "./form/Inputs"
import {getSearchProgram} from "../state/selectors/searchBar"
import {reactElementProps} from "../test/integration"
import Form from "./form/Form"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import brim from "../brim"

export function DebugModal() {
  return (
    <ModalBox
      name="debug"
      title="Debug Query"
      buttons="Done"
      className="debug-modal"
      {...reactElementProps("debugModal")}
    >
      <DebugModalContents />
    </ModalBox>
  )
}

function DebugModalContents() {
  let searchProgram = useSelector(getSearchProgram)
  let [program, setProgram] = useState(searchProgram)

  return (
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
          {...reactElementProps("debugProgram")}
        />
      </Form>
      <pre
        className="language-js"
        dangerouslySetInnerHTML={{__html: formatAst(program)}}
        {...reactElementProps("debugAst")}
      />
    </TextContent>
  )
}

function formatAst(program) {
  if (!program.length) {
    return Prism.highlight(
      JSON.stringify({}, null, 4),
      Prism.languages.js,
      "JSON"
    )
  }
  let ast = brim.program(program).ast()
  if (ast.valid()) {
    return Prism.highlight(
      JSON.stringify(ast.self(), null, 4),
      Prism.languages.js,
      "JSON"
    )
  } else {
    return ast.error().toString()
  }
}
