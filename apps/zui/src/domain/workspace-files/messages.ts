import * as ops from "./operations"

export type WorkspaceFilesOperations = {
  "workspaceFiles.read": typeof ops.read
  "workspaceFiles.contents": typeof ops.contents
}
