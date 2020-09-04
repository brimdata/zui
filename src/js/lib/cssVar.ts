
import { cssVar as polishedCssVar } from "polished";

/* JSDOM does not yet support css vars yet.
https://github.com/jsdom/jsdom/issues/1895
So we provide a fallback for the unit tests
*/
export function cssVar(name: string, fallback?: string | number = "lightgray") {
  try {
    return polishedCssVar(name);
  } catch (e) {
    return fallback;
  }
}