

import MarkdownIt from "markdown-it";
import React from "react";

import { Column } from "../../types";
import open from "../../lib/open";
import brim from "../../brim";

type Props = {
  column: Column;
  path: string;
};

export default function ColumnDescription({
  column,
  path
}: Props) {
  let info = brim.zeekLogInfo(path);
  let md = new MarkdownIt();
  let col = info.describeColumn(column);
  const createBody = () => ({
    __html: md.render(col.desc)
  });

  return <div className="column-description">
      <div className="tip-title">
        <p>{column.name}</p> <p>{col.type}</p>
      </div>
      <div className="tip-body">
        <p dangerouslySetInnerHTML={createBody()}></p>
      </div>
      {info.isKnown() && <div className="tip-footer">
          <a onClick={() => open(info.docsUrl())}>Link to Docs</a>
        </div>}
    </div>;
}