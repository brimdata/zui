import ZuiApi from "../zui-api"

export type Correlation = {
  id: string
  query: (api: ZuiApi) => Promise<string> | string
  when: (api: ZuiApi) => boolean
}
