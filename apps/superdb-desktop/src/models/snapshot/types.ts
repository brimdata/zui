export type CompilationErrorAttrs = {Msg: string; Pos: number; End: number}

export type DescribeErrorResponse = {
  error: {
    compilation_errors: CompilationErrorAttrs[]
    kind: string
    type: "error"
  }
}
