/* @flow */

import type {ModalName} from "../../state/Modal/types"

export type ModalButton = {label: string, click: Function}
export type ModalButtonTemplate = void | string | ModalButton[]
export type ModalBoxProps = {
  children: *,
  title: string,
  name: ModalName,
  className?: string,
  buttons: ModalButtonTemplate,
  onClose?: Function
}

export type ModalContentsProps = {
  ...ModalBoxProps,
  rest?: *
}
