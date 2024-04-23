import { Transaction, TransactionMeta } from './Transaction.js';

export class UnconfirmedAdded {
  constructor(
    public readonly transaction: Transaction,
    public readonly meta: TransactionMeta
  ) {}
}
