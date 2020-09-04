
import { useDispatch } from "react-redux";
import React from "react";

import ErrorFactory from "../models/ErrorFactory";
import Link from "./common/Link";
import LoadFilesInput from "./LoadFilesInput";
import Notice from "../state/Notice";
import errors from "../errors";
import ingestFiles from "../flows/ingestFiles";
import refreshSpaceNames from "../flows/refreshSpaceNames";

export default function TabImport() {
  const dispatch = useDispatch();

  function onChange(_e, files) {
    if (!files.length) return;
    dispatch(ingestFiles(files)).catch(e => {
      ;/(Failed to fetch)|(network error)/.test(e.cause.message) ? dispatch(Notice.set(errors.importInterrupt())) : dispatch(Notice.set(ErrorFactory.create(e.cause)));

      dispatch(refreshSpaceNames());
      console.error(e.message);
    });
  }

  return <div className="input-methods">
      <section>
        <h2>Import Files</h2>
        <LoadFilesInput onChange={onChange} />
        <footer>
          <p>
            <b>Accepted formats:</b> .pcap, .pcapng,{" "}
            <Link href="https://github.com/brimsec/zq/blob/master/zng/docs/spec.md">
              .zng
            </Link>
            , and{" "}
            <Link href="https://docs.zeek.org/en/current/scripts/base/frameworks/logging/writers/ascii.zeek.html">
              Zeek ASCII/JSON
            </Link>
            .
          </p>
          <p>
            <b>Note:</b> Multiple zng and Zeek log files may be imported, but
            only one pcap.
          </p>
        </footer>
      </section>
    </div>;
}