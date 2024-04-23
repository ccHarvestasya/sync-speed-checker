export class Transaction {
  constructor(
    public readonly signature: string,
    public readonly signerPublicKey: string,
    public readonly version: number,
    public readonly network: number,
    public readonly type: number,
    public readonly maxFee: string,
    public readonly deadline: string,
    public readonly recipientAddress: number,
    public readonly mosaics?: { id: string; amount: string }[],
    public readonly transactionsHash?: string,
    public readonly transactions?: InnerTransaction[]
  ) {}
}

export class InnerTransaction {
  constructor(
    public readonly signerPublicKey: string,
    public readonly version: number,
    public readonly network: number,
    public readonly type: number,
    public readonly recipientAddress: number,
    public readonly mosaics?: { id: string; amount: string }[]
  ) {}
}

export class TransactionMeta {
  constructor(
    public readonly hash: string,
    public readonly merkleComponentHash: string,
    public readonly height: string
  ) {}
}

export class TransactionRemoveMeta {
  constructor(public readonly hash: string) {}
}
