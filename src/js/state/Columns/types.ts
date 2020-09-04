

export type ColumnsAction = COLUMNS_UPDATE | COLUMNS_HIDE_ALL | COLUMNS_SHOW_ALL;

export type ColumnsState = {
  [key: string]: {
    [key: string]: ColumnSetting;
  };
};

export type ColumnSetting = {
  isVisible: boolean;
  width?: number;
  position?: number;
};

export type TableColumn = {
  isVisible: boolean;
  width: number | null | undefined;
  name: string;
  type: string;
  position: number;
};

export type ColumnSettingsMap = {
  [key: string]: ColumnSetting;
};

export type ColumnUpdates = {
  [key: string]: ColumnSetting;
};

export type COLUMNS_UPDATE = {
  type: "COLUMNS_UPDATE";
  tableId: string;
  updates: ColumnUpdates;
};

export type COLUMNS_SHOW_ALL = {
  type: "COLUMNS_SHOW_ALL";
  tableId: string;
};

export type COLUMNS_HIDE_ALL = {
  type: "COLUMNS_HIDE_ALL";
  tableId: string;
};