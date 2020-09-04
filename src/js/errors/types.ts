

export type BrimErrorType = "PCAPIngestError" | "NetworkError" | "LogsIngestError" | "SpaceDeletedError";

export type BrimError = {
  type: BrimErrorType;
  message: string;
  details?: string[];
};