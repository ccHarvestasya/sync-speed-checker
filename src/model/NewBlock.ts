export class NewBlock {
  constructor(public readonly block: Block, public readonly meta: Meta) {}
}

class Block {
  constructor(
    public readonly signature: string,
    public readonly signerPublicKey: string,
    public readonly version: number,
    public readonly network: number,
    public readonly type: number,
    public readonly height: bigint,
    public readonly timestamp: string,
    public readonly difficulty: string,
    public readonly proofGamma: string,
    public readonly proofVerificationHash: string,
    public readonly proofScalar: string,
    public readonly previousBlockHash: string,
    public readonly transactionsHash: string,
    public readonly receiptsHash: string,
    public readonly stateHash: string,
    public readonly beneficiaryAddress: string,
    public readonly feeMultiplier: number
  ) {}
}

class Meta {
  constructor(public readonly hash: string, public readonly generationHash: string) {}
}
