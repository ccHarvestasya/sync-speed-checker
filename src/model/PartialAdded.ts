import { Transaction, TransactionMeta } from './Transaction.js';

export class PartialAdded {
  constructor(
    public readonly transaction: Transaction,
    public readonly meta: TransactionMeta
  ) {}
}
