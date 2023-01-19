import {createListView} from "./create-list-view"

function controller<T>(initialValue: T) {
  return {
    value: initialValue,
    onChange: (next: T) => {},
  }
}

test("list view props", () => {
  createListView({
    values: [],
    shapes: [],
    valueExpandedState: controller<Record<string, boolean>>({}),
    valuePageState: controller<Record<string, number>>({}),
    valueExpandedDefaultState: controller<boolean>(true),
    viewConfig: {},
    valueProps: {
      onClick: () => {},
      onContextMenu: () => {},
    },
  })
})
