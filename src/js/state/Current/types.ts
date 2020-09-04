

export type CurrentState = {
  connectionId: string | null;
  spaceId: string | null;
};

export type CurrentAction = CURRENT_SPACE_SET | CURRENT_CONNECTION_SET;

export type CURRENT_SPACE_SET = {
  type: "CURRENT_SPACE_SET";
  id: string | null;
};

export type CURRENT_CONNECTION_SET = {
  type: "CURRENT_CONNECTION_SET";
  id: string | null;
};