import {useResponse} from "test/responses"

const dns = useResponse("dns")

test("hi", () => {
  console.log(dns)
})
