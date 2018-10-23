/* @flow */

export const setNoticeError = (message: string) => ({
  type: "NOTICE_ERROR_SET",
  message
})

export const dismissNotice = () => ({
  type: "NOTICE_DISMISS"
})
