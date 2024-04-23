export class ErrorStatus {
  constructor(
    public readonly hash: string,
    public readonly code: string,
    public readonly deadline: string
  ) {}
}
