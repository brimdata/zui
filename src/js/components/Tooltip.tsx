

import React from "react";
import ReactDOM from "react-dom";

import lib from "../lib";

type Props = {
  style: Object;
  children: any;
};

export default class Tooltip extends React.Component<Props> {

  render() {
    return ReactDOM.createPortal(<div className="tool-tip" style={this.props.style}>
        {this.props.children}
      </div>, lib.doc.id("tooltip-root"));
  }
}