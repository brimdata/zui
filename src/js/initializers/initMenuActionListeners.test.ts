
import initMenuActionListeners from "./initMenuActionListeners";
import initTestStore from "../test/initTestStore";

test("Each action has a listener", () => {
  let store = initTestStore();
  initMenuActionListeners(store.dispatch);
});