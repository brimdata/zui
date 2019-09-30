/* @flow */
import {useSelector} from "react-redux"
import Prism from "prismjs"
import React, {useState} from "react"

import {Input} from "./form/Inputs"
import {getSearchProgram} from "../state/selectors/searchBar"
import Form from "./form/Form"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import brim from "../brim"
import {reactElementProps} from "../test/integration"

export function DebugModal() {
  let searchProgram = useSelector(getSearchProgram)
  let [program, setProgram] = useState(searchProgram)

  return (
    <ModalBox
      name="debug"
      title="Debug Query"
      buttons="Done"
      className="debug-modal"
    >
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
    </ModalBox>
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
