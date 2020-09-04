
import { ViewerSelectionData } from "../types";

export type ViewerSelection = ViewerSelectionData & {
  includes: (arg0: number) => boolean;
  isEmpty: () => boolean;
  getIndices: () => number[];
};

export function createSelection(data: ViewerSelectionData): ViewerSelection {
  return {
    ...data,
    getIndices() {
      return Object.entries(data.rows).filter(entry => entry[1]).map(entry => parseInt(entry[0]));
    },

    isEmpty() {
      return Object.entries(data.rows).length === 0;
    },

    includes(row: number) {
      return data.rows[row] === true;
    }
  };
}