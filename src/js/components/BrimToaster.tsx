import React from "react"
import {Toaster} from "react-hot-toast"

const BrimToaster = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        role: "status",
        className: "brim-toast",
        loading: {
          // This is so that the loading indicator does not go away.
          duration: 2 ** 31 - 1,
        },
        success: {
          duration: 6000,
        },
      }}
    />
  )
}

export default BrimToaster
