import env from "src/app/core/env"
import React from "react"
import {Toaster} from "react-hot-toast"

const BrimToaster = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        role: "status",
        className: "brim-toast",
        duration: env.isTest ? 2 ** 31 - 1 : undefined,
        success: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined,
        },
        loading: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined,
        },
        error: {
          duration: env.isTest ? 2 ** 31 - 1 : undefined,
        },
      }}
    />
  )
}

export default BrimToaster
