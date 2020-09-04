

import { MODAL_HIDE, MODAL_SHOW, ModalName } from "./types";

export default {
  show: (name: ModalName, args: Object): MODAL_SHOW => ({
    type: "MODAL_SHOW",
    name,
    args
  }),

  hide: (): MODAL_HIDE => ({
    type: "MODAL_HIDE"
  })
};