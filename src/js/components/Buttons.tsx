

import * as React from "react";
import classNames from "classnames";

import Caret from "./icons/caret-bottom-sm.svg";
import MenuBarButton from "./MenuBarButton";
import X from "./icons/x-md.svg";

type Children = {
  children: React.ReactNode | null | undefined;
};

export const ButtonGroup = ({
  children
}: Children) => <div className="button-group">{children}</div>;

export const ThinButton = ({
  children,
  ...rest
}: Children) => <button {...rest} className="thin-button">
    {children}
  </button>;

export class ThinPicker extends React.Component<{}> {

  render() {
    return <MenuBarButton {...this.props} className="thin-picker">
        <Caret />
      </MenuBarButton>;
  }
}

type Props = {
  className: string;
};

export function ExpandButton({
  open,
  className,
  ...props
}: Props & {
  open: boolean;
}) {
  return <div {...props} className={classNames("expand-button", className, { open })}>
      <Caret />
    </div>;
}

export function RemoveButton({
  className,
  ...props
}: Props) {
  return <div {...props} className={classNames("remove-button", className)}>
      <X />
    </div>;
}