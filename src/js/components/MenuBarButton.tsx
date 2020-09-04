
import * as React from "react";
import classNames from "classnames";

import ClockIcon from "../icons/ClockIcon";
import DropdownArrow from "../icons/DropdownArrow";

type Props = {
  children: any;
  dropdown?: boolean;
  className?: string;
  icon?: React.ReactNode;
};


const MenuBarButton = React.forwardRef(function MenuBarButton({
  className,
  children,
  dropdown,
  icon,
  ...props
}: Props, ref) {
  return <button {...props} ref={ref} className={classNames(className, "toolbar-button")}>
      {!!icon && <span className="icon">
          <ClockIcon />
        </span>}

      <span className="text">{children}</span>
      {dropdown && <DropdownArrow />}
    </button>;
});

export default MenuBarButton;