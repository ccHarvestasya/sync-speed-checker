import { TransactionRemoveMeta } from './Transaction.js';

export class PartialRemoved {
  constructor(public readonly meta: TransactionRemoveMeta) {}
}
