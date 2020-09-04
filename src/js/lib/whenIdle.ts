
import onIdle from "on-idle";

export default function whenIdle(func: Function) {
  let _cancel = () => {};

  let lazy = function (...args: any) {
    _cancel();
    _cancel = onIdle(() => func(...args));
  };

  lazy.cancel = _cancel;
  return lazy;
}