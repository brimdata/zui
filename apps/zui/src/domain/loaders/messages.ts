export type LoadFormData = {
  poolId: string
  name: string | null
  key: string | null
  order: "asc" | "desc" | null
  files: string[]
  author: string
  message: string
}

export type LoadersOperations = {
  "loaders.formAction": (data: LoadFormData) => void
}
