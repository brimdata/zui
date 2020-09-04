
import initCleanup from "./initCleanup";
import initDOM from "./initDOM";
import initGlobals from "./initGlobals";
import initIpcListeners from "./initIpcListeners";
import initMenuActionListeners from "./initMenuActionListeners";
import initStore from "./initStore";
import initZqdConnection from "./initZqdConnection";

export default async function initialize() {
  const store = await initStore();
  initDOM();
  initGlobals(store);
  initCleanup(store);
  initIpcListeners(store);
  initMenuActionListeners(store);
  await initZqdConnection(store);
  return store;
}