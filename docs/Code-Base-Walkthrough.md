Thanks for contributing to Brim! Here are a few pointers to help you understand the code base and feel confident making changes.



## Entry Point

A very high level overview of the boot process goes like this:

The first file executed is `src/js/electron/main.js`. It will create a BrowserWindow and load the `search.html` file, which loads JavaScript in  `src/js/search.js`. `src/js/search.js` creates the DOM needed to mount React, then renders the `src/js/components/App.js` component.



## Directory Structure

All these directories assume you are in `src/js/`. 

**search.js, about.js, detail.js**

These are the entry points for the three types of windows in the App.

**/brim**

Domain specific structures like `log`, `field`, `record`, and `program`.

**/components** 

All React components used within the app.

**/electron**

Code intended to run in [Electron's main process](https://www.electronjs.org/docs/tutorial/application-architecture). Also contains the app's entry point, `src/js/electron/main.js`.

**/errors**

A place for known app errors to be built.

**/flows**

Business logic for the app like `submitSearch` `createSpace` `exportResults`. These files contain redux thunks which allow them to access state and dispatch actions.

**/initializers**

Code that boots up in the browser window. It creates the redux store, adds ipc listeners, etc.

**/lib**

Generic structures that are helpful to have like `file`, `doc`, `win`,`is`,`transaction`. They are independent and could be used in another project.

**/models**

Legacy location for domain specific structures.

**/searches**

Deprecated, this held logic to issue different types of searches within the app, now available in `/flows`.

**/services**

Code that helps call out to third-party services.

**/state**

All the redux reducers, actions, and selectors go in this directory. It's organized by the slice they manage, like: `History`, `Modal`, `Layout`, `Viewer`, `Tabs`.

**/stdlib**

Deprecated, generic structures should now live in `lib`.

**/style-theme**

Where the shared colors and styles exist for the Styled Components library.

**/test**

Test helpers and test data. Actual unit tests should go next to the files they exercise.

**/types**

A place for generic flow types that are used throughout the app. If you need to create a type that is specific to a component or a class, define and export it from here.

**/zqd**

Code that runs the backend zqd process on localhost.



## Libraries

We are an Electron app, so [electron](https://www.electronjs.org/docs) is the core library we use. For those unfamiliar, it's helpful to understand the [main vs renderer processes](https://www.electronjs.org/docs/tutorial/application-architecture) in an Electron app.

Additionally, we rely heavily on the node modules listed here:

**JavaScript** 

- [Flow Type Checker](https://flow.org/) Check for errors with `npm run flow`
- [ESLint](https://eslint.org/) Check for errors with `npm run lint`
- [Prettier](https://prettier.io/docs/en/index.html) All code must be formatted with `npm run format`

**Rendering**

- [React](https://reactjs.org/docs/getting-started.html) 
- [React Hooks](https://reactjs.org/docs/hooks-intro.html) We make use of the hooks api extensively
- [Styled Components](https://styled-components.com/) For CSS in JS

**State Management**

- [Redux](https://redux.js.org/introduction/getting-started) 
- [Redux Thunk](https://github.com/reduxjs/redux-thunk) A small utility to allow for async actions
- [Immer](https://immerjs.github.io/immer/docs/introduction) Used in reducers to work with immutable state in a more convenient way

**Testing**

- [Jest ](https://jestjs.io/docs/en/getting-started) Unit tests are run with `npm run test`
- [Spectron](https://www.electronjs.org/spectron) Used for integration testing `npm run itest`
- [Enzyme](https://enzymejs.github.io/enzyme/docs/api/) Used only a little for testing Components



## Patterns

**Closures over Classes**

For utility classes and domain models, we've been using functions that return objects with methods and data, rather than the `Class`. Prefer this style over classes if possible. 

```js
// Closure for example (preferred)
function createLog(data) {
  return {
    getField: (name) => data.find(f => f.name === name)
  }
}
```

```js
// Class for example (not preferred)
Class Log {
  constructor(data) {
    this.data = data
  }
  
  getFieid(name) {
    return this.data.find(f => f.name === name)
  }
}
```



**Testing**

Tests go right next to file they are testing with a `.test.js` suffix. Tests can accompany:

* State slices (actions, selectors)
* Business logic
* Domain classes
* Utility classes
* React Components

However, it's not very easy to test React components in unit tests, so we don't have many. The integration tests help with coverage there.

**Hooks**

There are some useful, generic hooks located in `src/js/components/hooks`.


## Diverging Patterns

Some areas of the code do the same thing in two different ways. It can be difficult for new developers to know which pattern to choose. Hopefully this will help.

**Models**

Don't put new classes in the `src/js/models` directory. Instead, put domain classes in the `src/js/brim` directory and put utility models in the `src/js/lib/` directory. The models directory used to contain all domain and utility classes. Note that the structures in `src/js/lib` are also in transition. There are some domain specific ones there that should be moved.

**Styles**

Use the Styled Components library to style new components. Previously, we used scss files located in `src/css`. Many of the components are styled with scss, and class names, but we recently committed to Styled Components. We also have a "theme" that holds all the common colors and styles used in our UI.

**Functional Components**

Do not make new components using the React "Class" component API. Instead use the functional component API.

**Animation**

There is no solid convention on how to create animations. We've attempted `anime.js`, `react-spring.js`, native Web Animations , and css animation/transition properties. New code can use any method they prefer and seems appropriate. I'd say avoid react-spring because there are lots of API changes coming in v9. In the future, for drag and drop (like dragging around the tabs), I'd like to try out `react-beautiful-dnd`. I think that could replace our usage of `react-spring` and make the code much more readable.

**API Client**

Use the `zealot` client to communicate with the backend. This is used for searching, getting the list of spaces, ingesting into a space, and more. We are transitioning away from using the `BoomClient` for this purpose.



## Migrations

Because we persist state on a user's computer, if they upgrade Brim and we've changed the expected state, we need to migrate the old state. If any of the reducers in `src/js/state` are changed, we need to write a migration. There is a tool we built to help with this. You can run, for example:

```bash
bin/gen migration addScrollPositionToViewer
```

This creates a file in `src/js/state/migrations` with a function that can manipulate the persisted state from the previous version.
