import {BrimError} from "src/js/errors/types"

export type NoticeState = {
  error: BrimError | null | undefined
  visible: boolean
}
export type NoticeAction = NOTICE_SET | NOTICE_CLEAR | NOTICE_DISMISS

export type NOTICE_SET = {type: "NOTICE_SET"; error: any}
export type NOTICE_CLEAR = {type: "NOTICE_CLEAR"}
export type NOTICE_DISMISS = {type: "NOTICE_DISMISS"}
