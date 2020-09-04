
import flows from "./flows";
import reducer from "./reducer";
import selectors from "./selectors";

export default {
  reducer,
  ...selectors,
  ...flows
};