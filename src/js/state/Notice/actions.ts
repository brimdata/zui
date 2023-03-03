import {ErrorData} from "src/js/errors/types"
import AppError from "../../models/AppError"
import {NOTICE_CLEAR, NOTICE_DISMISS, NOTICE_SET} from "./types"

export default {
  set: (error: AppError | ErrorData): NOTICE_SET => ({
    type: "NOTICE_SET",
    error: error instanceof AppError ? error.toError() : error,
  }),
  clear: (): NOTICE_CLEAR => ({type: "NOTICE_CLEAR"}),
  dismiss: (): NOTICE_DISMISS => ({type: "NOTICE_DISMISS"}),
}
