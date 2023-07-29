import { BaseClient } from './base-client';

export class Client extends BaseClient {
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  public fetch = (...args: any[]) => window.fetch(...args);
}
