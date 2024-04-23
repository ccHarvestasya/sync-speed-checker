/**
 * FinalizedBlock
 */
export class FinalizedBlock {
  /**
   * コンストラクタ
   * @param finalizationEpoch エポック
   * @param finalizationPoint ポイント
   * @param height ブロック高
   * @param hash ハッシュ
   */
  constructor(
    /**
     * ファイナライゼーションエポック
     */
    public readonly finalizationEpoch: number,

    /**
     * ファイナライゼーションポイント
     */
    public readonly finalizationPoint: number,

    /**
     * ファイナライズブロック高
     */
    public readonly height: string,

    /**
     * ファイナライズハッシュ
     */
    public readonly hash: string
  ) {}
}
