import Tiles from "src/js/state/Tiles"

export default (layout) => (_d, _gs, {dispatch}) => {
  const updates = layout.map(({x, y, h, w, i}) => ({
    id: i,
    changes: {layout: {x, y, h, w}}
  }))
  dispatch(Tiles.updateMany(updates))
}
