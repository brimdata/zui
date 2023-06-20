# Coding Patterns

This is here to document the design patterns chosen by the developers. It documents structures, abstractions, and philosophy in this repo.

## Glossary of Terms

In no particular order.

_Domain_

A named concept relative to the Zui app. Examples of domains are pools, queries, panes, configurations, plugins. First-class things that people can point to when they describe the app.

_Main Object_

The main object contains methods for managing the application in the main process. It can manage windows, session data, plugins, and app lifecycle.

_Operation_

A function that runs in the main process and has the main object in scope. When the app boots, operations begin listening for IPC invocations from a renderer processes. They can also be called directly from the main process using their .run() method. When invoking an operation from the main process, use the invoke function found in src/core/invoke.ts.

_Plugin Api_

The plugin api runs in the Node main process and is given to plugin authors to extend the app. It should not have privilaged access to everything. Only what is useful for plugin authors. This means it should not contain references to the full store or the main process. Instead, it exposes methods that in turn call operations. Operations are not exposed to plugins and therefore have the main object and store in scope. The pattern should be: plugin-api exposes a simple method which then runs an operation.
