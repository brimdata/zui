/* @flow */
import {files} from "../../test/mockLogs"
import Md5Search from "./Md5Search"

test("#getProgram", () => {
  let search = new Md5Search(files(), [new Date(0), new Date(1)])

  expect(search.getProgram()).toEqual(
    "md5=- | count() by filename, mime_type | sort -r | head 5; count() by md5 | sort -r | head 5; count() by rx_hosts | sort -r | head 5; count() by tx_hosts | sort -r | head 5"
  )
})
