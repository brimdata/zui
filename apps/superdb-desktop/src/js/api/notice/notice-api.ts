import {ErrorData} from "src/js/errors/types"
import AppError from "src/js/models/AppError"
import Notice from "src/js/state/Notice"
import {ApiDomain} from "../api-domain"

export class NoticeApi extends ApiDomain {
  error(error: AppError | ErrorData) {
    this.dispatch(Notice.set(error))
  }
}
