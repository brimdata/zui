export const workspacePath = (id) => `/workspaces/${id}`
export const workspacesPath = () => `/workspaces`
export const lakePath = (id, workspaceId) =>
  `/workspaces/${workspaceId}/lakes/${id}`
