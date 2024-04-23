export class Cosignature {
  constructor(
    public readonly version: string,
    public readonly signerPublicKey: string,
    public readonly signature: string,
    public readonly parentHash: string
  ) {}
}
