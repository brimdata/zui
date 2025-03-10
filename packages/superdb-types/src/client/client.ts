import { BaseClient } from './base-client';

export class Client extends BaseClient {
  // @ts-ignore
  public fetch = (...args: any[]) => window.fetch(...args);
}
