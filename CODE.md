# Coding Patterns

This is here to document the design patterns chosen by the developers. It documents structures, abstractions, and philosophy in this repo.

## FAQs

### How do I add a main process initializer?

1. Create a new file in `src/electron/initializers/`.
2. Export a function called _initialize_(main) that takes the main object as its only argument.
3. Add the following line to `src/electron/initializers/index.ts`.

```
export * as myNewInitializer from "./my-new-initializer"
```

Export all symbols as a camel cased alias of the file name. This will now run automatically when the app starts.

### How do I write a state migration?

1. Run `bin/gen migration my_migration_name`.
2. Edit the files it produced to perform your migration.
3. Use the getAllTabs and getAllStates helpers as needed.
4. Remember that the states are either the main process state or the window states.
5. Add that file to the src/js/state/migrations/index.ts following the pattern there.
6. Create a sample state, if needed, by running the app at the latest released version, getting it into the state you want, then copying run/appState.json into src/test/unit/states/v0.0.0.json using the version as the file name.

## Folders

Documentation for where code should go.

### src/domain

Domains are concepts specific to Zui. Things like pools, queries, sessions, history. A domain can contain operations, handlers, a plugin-api, models, types.

### src/core

Core objects and functions can be used across multiple domains. Like menus and commands.

### src/util

This is super generic JavaScript code that knows nothing about Zui, Electron, or Web. It can be copied into another project and work right out of the gate. Code must contain no dependencies in this folder.

### src/plugins

This is a directory of plugins that use the plugin api to add functionality to the app. Some of the plugins are prefixed with the word "core" to indicate they provide core functionality, but only require the plugin api to achieve this. To add a plugin today, create a new directory in the plugins directory, create an `index.ts` file within it, then export a named function called "activate". It will accept the PluginContext object as its only argument. Then go to the `run-plugins.ts` file and call the activate function within the body of runPlugins. This could be made automatic one day, but it's hardcoded for now.

## Glossary of Terms

In no particular order.

_Domain_

A named concept relative to the Zui app. Examples of domains are pools, queries, panes, configurations, plugins. First-class things that people can point to when they describe the app.

_Main Object_

The main object contains methods for managing the application in the main process. It can manage windows, session data, plugins, and app lifecycle.

_Operation_

A function that runs in the main process and has the main object in scope. When the app boots, operations begin listening for IPC invocations from a renderer process. They can also be called directly from the main process using their .run() method. When invoking an operation from the main process, use the invoke function found in src/core/invoke.ts.

_Handler_

A handler is an event listener in the renderer process. It waits for a message from the main process before running its callback function. Messages can be sent to handlers from the main process using sendToFocusedWindow(message, ...arguments).

_Message_

A message is a TypeScript type defining a name and a set of arguments. Messages are necessary to provide types for Operations and Handlers.

_Plugin Api_

The plugin api runs in the Node main process and is given to plugin authors to extend the app. It should not have privileged access to everything. Only what is useful for plugin authors. This means it should not contain references to the full store or the main process. Instead, it exposes methods that in turn call operations. Operations are not exposed to plugins and therefore have the main object and store in scope. The pattern should be: plugin-api exposes a simple method which then runs an operation.

_Main Process Initializers_

Code that needs to be run one time before the app starts up can be put in an initializer. An initializer is a file that lives in the folder `src/electron/initializers/`. It must export a function named _initialize(main)_ that takes the Main Object as its only argument. See the FAQ for an example of creating a new initializer.

_Query_

A query in the app is like a container object. It holds the name and id of the query. It does not contain the zed code. Those are stored in a QueryVersion. Each Query has many QueryVersions, showing the history of that query.

_Session Query_

A session query is like an unnamed Query. Each session (tab) has exactly one SessionQuery associated with it. The SessionQuery has many QueryVersions associated with it.

_Store_

The store contains the state for the whole application. Parts of the store apply to the whole app (main process and all windows), like the list of lakes, the list of the pools, the list of queries, and the configurations. Then state only relevant to one window, then state that's only relative to the tab.

**State Hierarchy**

1. Application Level
2. Window Level
3. Tab Level

Application level state has a `$` prefix to the action names. Actions dispatched with the `$` prefix get dispatched to the main process and all windows.

Window level state is everything that's not in the `tabReducer`, but doesn't have a `$` prefix.

Tabs state is found in the `tabReducer` function.

The tabs are grouped by lakeId within the window state. Each window has a different group of tabs per lakeId. When a user switches lakes, the tabs from the previous lake will be hidden and the tabs from the current lake shown. When switching back, the old tabs will be restored.
