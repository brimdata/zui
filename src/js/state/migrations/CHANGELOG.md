# History of State Migrations

Each time the state changes, please record it here. Then when we perform a release, we can see all the changes to the state that have happened.

### Version 1.1.0 Released on May 22, 2023

### Moved Secondary Sidebar State from Layout to Appearance on July 13, 2023

The secondary sidebar (right sidebar) needs its state at the window level. It should not hide/show based on the tab that is selected. It should also not change width as we move around tabs.

These two properties moved from Layout reducer to Appearance

```ts
// Layout
    rightSidebarIsOpen: true,
    rightSidebarWidth: 260,
// Appearance
    // renamed to
    secondarySidebarIsOpen: true,
    secondarySidebarWidth: 250,
```

## Move Tabs Under Lakes on July 13, 2023

The tabs used to be in the top level state. They are now nested under the window slice state. Migration has been written.

## Move Panel Size on July 18, 2023

Removed react-resizable-panels from project and now keep sizes in redux. No migration needed. All new values have defaults.
