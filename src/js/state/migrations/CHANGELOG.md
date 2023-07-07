# History of State Migrations

Each time the state changes, please record it here. Then when we perform a release, we can see all the changes to the state that have happened.

### Version 1.1.0 Released

May 22, 2023

### Moved Secondary Sidebar State from Layout to Appearance

The secondary sidebar (right sidebar) needs its state at the window level. It should not hide/show based on the tab that is selected. It should also not change width as we move around tabs.
