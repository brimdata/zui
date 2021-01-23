import Tiles from "src/js/state/Tiles"

export default (layout) => (_d, _gs, {globalDispatch}) => {
  const updates = layout.map(({x, y, h, w, i}) => ({
    id: i,
    changes: {layout: {x, y, h, w}}
  }))
  globalDispatch(Tiles.updateMany(updates))
}
