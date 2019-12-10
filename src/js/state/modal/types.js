/* @flow */

export type ModalName =
  | "debug"
  | "settings"
  | "whois"
  | "curl"
  | "nodata"
  | "boom-get"

export type MODAL_SHOW = {
  type: "MODAL_SHOW",
  name: ModalName,
  args: Object
}

export type MODAL_HIDE = {
  type: "MODAL_HIDE"
}

export type ModalActions = MODAL_SHOW | MODAL_HIDE

export type ModalState = {
  name: string,
  args: Object
}
