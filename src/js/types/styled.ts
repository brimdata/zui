
import * as React from "react";

export type Styled<Props extends Object = {}> = React$ComponentType<Props & {
  children?: React.ReactNode;
}>;