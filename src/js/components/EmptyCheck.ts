
import { isEmpty } from "lodash";
import * as React from "react";

type Props = {children: React.ReactNode;empty: React.ReactNode;array: any[];};

export default function EmptyCheck({
  children,
  array,
  empty
}: Props) {
  if (isEmpty(array)) {
    return empty;
  } else {
    return children;
  }
}