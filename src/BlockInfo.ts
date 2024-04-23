export class BlockInfo {
  public blockHeight: bigint;
  public time: Date;
  constructor() {
    this.blockHeight = 0n;
    this.time = new Date();
  }
}
