

import { ViewerDimens } from "../../types";

export const viewer = (dimens: ViewerDimens) => {
  return {
    width: dimens.viewWidth
  };
};

export const view = (dimens: ViewerDimens) => {
  return {
    height: dimens.viewHeight,
    width: dimens.viewWidth
  };
};

export const header = (dimens: ViewerDimens, scrollLeft: number) => {
  return {
    width: dimens.listWidth,
    transform: `translateX(${scrollLeft * -1}px)`
  };
};

export const list = (dimens: ViewerDimens) => {
  return {
    height: dimens.listHeight,
    width: dimens.listWidth
  };
};

export const chunk = (dimens: ViewerDimens, index: number, chunkSize: number) => {
  return {
    width: dimens.rowWidth,
    transform: `translateY(${index * dimens.rowHeight}px)`,
    height: dimens.rowHeight * chunkSize
  };
};

export const row = (dimens: ViewerDimens) => {
  return {
    width: dimens.rowWidth,
    height: dimens.rowHeight
  };
};

export const endMessage = (dimens: ViewerDimens) => {
  return {
    height: dimens.rowHeight * 4,
    transform: `translateY(${dimens.listHeight}px)`,
    width: dimens.viewWidth
  };
};