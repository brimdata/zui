/* @flow */

import type {BoomPayload, Span} from "../services/BoomClient/types"
import type {Dispatch} from "../state/types"

export type SearchCallbackMap = {
  each?: (BoomPayload) => *,
  error?: (string) => *,
  abort?: () => *
}

export type SearchTemplate = {
  name: string,
  tag: string,
  program: string,
  span: Span,
  handlers?: SearchHandler[]
}

export type SearchHandler = (Dispatch, SearchTemplate) => SearchCallbackMap
