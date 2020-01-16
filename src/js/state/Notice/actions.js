/* @flow */

import type {NOTICE_CLEAR, NOTICE_DISMISS, NOTICE_SET} from "./types"
import AppError from "../../models/AppError"

export default {
  set: (error: AppError): NOTICE_SET => ({type: "NOTICE_SET", error}),
  clear: (): NOTICE_CLEAR => ({type: "NOTICE_CLEAR"}),
  dismiss: (): NOTICE_DISMISS => ({type: "NOTICE_DISMISS"})
}
