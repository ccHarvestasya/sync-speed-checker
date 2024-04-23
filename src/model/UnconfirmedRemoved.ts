import { TransactionRemoveMeta } from './Transaction.js';

export class UnconfirmedRemoved {
  constructor(public readonly meta: TransactionRemoveMeta) {}
}
