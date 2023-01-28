export type ModalState = {name: string; args: Object}
export type ModalAction = MODAL_SHOW | MODAL_HIDE

export type MODAL_SHOW = {
  type: "MODAL_SHOW"
  name: ModalName
  args: Object
}
export type MODAL_HIDE = {
  type: "MODAL_HIDE"
}

export type ModalName =
  | "settings"
  | "export"
  | "ingest-warnings"
  | "new-lake"
  | "view-lake"
  | "whois"
