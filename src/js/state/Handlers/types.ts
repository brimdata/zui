

export type HandlersState = {
  [key: string]: Handler;
};

export type Handler = SearchHandler | IngestHandler;

export type SearchHandler = {
  type: "SEARCH";
  abort: (arg0: boolean) => void;
};

export type IngestHandler = {
  type: "INGEST";
  spaceId: string;
};

export type HandlersAction = HANDLERS_REGISTER | HANDLERS_ABORT | HANDLERS_REMOVE | HANDLERS_ABORT_ALL;

export type HANDLERS_REGISTER = {
  type: "HANDLERS_REGISTER";
  id: string;
  handler: Handler;
};
export type HANDLERS_ABORT = {
  type: "HANDLERS_ABORT";
  id: string;
  emit: boolean;
};
export type HANDLERS_REMOVE = {
  type: "HANDLERS_REMOVE";
  id: string;
};
export type HANDLERS_ABORT_ALL = {
  type: "HANDLERS_ABORT_ALL";
  emit: boolean;
};