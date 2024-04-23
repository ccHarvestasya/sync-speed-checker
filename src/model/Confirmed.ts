import { Transaction, TransactionMeta } from './Transaction.js';

export class Confirmed {
  constructor(
    public readonly transaction: Transaction,
    public readonly meta: TransactionMeta
  ) {}
}
