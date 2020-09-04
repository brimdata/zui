
import { useEffect } from "react";

export default function useEventListener(el: Node, name: string, callback: Function, deps: any[] | null | undefined) {
  useEffect(() => {
    el.addEventListener(name, callback, false);
    return () => el.removeEventListener(name, callback, false);
  }, deps);
}