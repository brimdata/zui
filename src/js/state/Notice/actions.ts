import {BrimError} from "src/js/errors/types"
import AppError from "../../models/AppError"
import {NOTICE_CLEAR, NOTICE_DISMISS, NOTICE_SET} from "./types"

export default {
  set: (error: AppError | BrimError): NOTICE_SET => ({
    type: "NOTICE_SET",
    error: error instanceof AppError ? error.toBrimError() : error
  }),
  clear: (): NOTICE_CLEAR => ({type: "NOTICE_CLEAR"}),
  dismiss: (): NOTICE_DISMISS => ({type: "NOTICE_DISMISS"})
}
