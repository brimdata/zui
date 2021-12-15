import env from "app/core/env"
import React from "react"
import {Toaster, useToasterStore} from "react-hot-toast"

const BrimToaster = () => {
  const {toasts, pausedAt} = useToasterStore()

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "brim-toast",
        duration: env.isTest ? 2 ** 31 - 1 : undefined,
        success: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined
        },
        loading: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined
        },
        error: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined
        }
      }}
    />
  )
}

export default BrimToaster
