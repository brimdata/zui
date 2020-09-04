

export type FieldValue = string | null | FieldValue[];

export type FieldData = {
  name: string;
  type: string;
  value: FieldValue;
};

export type RecordData = FieldData[];