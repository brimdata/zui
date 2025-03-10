export const isReduxAction = ({type}) => {
  /* Redux dispatches a few actions that start with @@ to populate the store
    with all the initial states. When our app starts up, we want to populate
    each tab with it's initial state since we don't persist the entire state
    of each tab. */
  return type.startsWith("@@")
}
