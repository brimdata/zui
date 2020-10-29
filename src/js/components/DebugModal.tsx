import {useSelector} from "react-redux"
import Prism from "prismjs"
import React, {useState} from "react"

import {reactElementProps} from "../test/integration"
import InputField from "./common/forms/InputField"
import InputLabel from "./common/forms/InputLabel"
import SearchBar from "../state/SearchBar"
import TextInput from "./common/forms/TextInput"
import brim from "../brim"
import {
  Pre,
  Content,
  Footer,
  Scrollable,
  Title
} from "./ModalDialog/ModalDialog"
import ToolbarButton from "./Toolbar/Button"
import useEnterKey from "./hooks/useEnterKey"

export function DebugModal({onClose}) {
  useEnterKey(onClose)
  const searchProgram = useSelector(SearchBar.getSearchProgram)
  const [program, setProgram] = useState(searchProgram)

  return (
    <Content width={600}>
      <Title>Debug Query</Title>
      <p>
        Type a query in the text box to see the parsed abstract syntax tree
        (AST).
      </p>
      <InputField>
        <InputLabel>Query</InputLabel>
        <TextInput
          autoFocus
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          {...reactElementProps("debugProgram")}
        />
      </InputField>
      <Scrollable>
        <Pre
          className="language-js"
          dangerouslySetInnerHTML={{__html: formatAst(program)}}
          {...reactElementProps("debugAst")}
        />
      </Scrollable>
      <Footer>
        <ToolbarButton text="Done" onClick={onClose} />
      </Footer>
    </Content>
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
  const ast = brim.program(program).ast()
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
