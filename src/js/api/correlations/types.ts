import BrimApi from ".."

export type Correlation = {
  id: string
  query: (api: BrimApi) => Promise<string> | string
  when: (api: BrimApi) => boolean
}
