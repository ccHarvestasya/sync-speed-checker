import Websocket from 'ws';

import { FinalizedBlock } from '../model/FinalizedBlock.js';
import { NewBlock } from '../model/NewBlock.js';
import { Confirmed } from '../model/Confirmed.js';
import { Cosignature } from '../model/Cosignature.js';
import { ErrorStatus } from '../model/ErrorStatus.js';
import { PartialAdded } from '../model/PartialAdded.js';
import { PartialRemoved } from '../model/PartialRemoved.js';
import { UnconfirmedAdded } from '../model/UnconfirmedAdded.js';
import { UnconfirmedRemoved } from '../model/UnconfirmedRemoved.js';

/**
 * 汎用コールバック型
 */
type Callback = (arg: object) => void;

/**
 * Listener
 * WebSocketを管理する。
 */
export class Listener {
  private _functionMap = new Map<string, (arg: object) => void>();
  private _listener: Websocket | undefined = undefined;

  /**
   * チャンネル名
   */
  private _listenerChannelName = {
    confirmedAdded: 'confirmedAdded',
    cosignature: 'cosignature',
    finalizedBlock: 'finalizedBlock',
    newBlock: 'block',
    partialAdded: 'partialAdded',
    partialRemoved: 'partialRemoved',
    status: 'status',
    unconfirmedAdded: 'unconfirmedAdded',
    unconfirmedRemoved: 'unconfirmedRemoved',
  };

  private _uid = '';

  private _wsUrl = '';

  /**
   * コンストラクタ
   * @param _host ホスト
   * @param _isHttps HTTPs有無(デフォルト: false)
   * @param _isAlwaysConnected 常時接続(デフォルト: false)
   */
  constructor(
    private readonly _host: string,
    private readonly _isHttps: boolean = false,
    private _isAlwaysConnected: boolean = false,
    private readonly timeout: number = 3000
  ) {
    this._wsUrl = this._isHttps
      ? `wss://${this._host}:3001/ws`
      : `ws://${this._host}:3000/ws`;
  }

  /**
   * リスナーを閉じる
   * @returns none
   */
  close(): void {
    this._isAlwaysConnected = false;
    this._listener?.close();
  }

  /**
   * WebSocket利用可能チェック
   * @returns true: 利用可能
   */
  async isWebsokectAvailable(): Promise<boolean> {
    if (this._listener) return true;
    return new Promise<boolean>((resolve) => {
      const lsnr = new Websocket(this._wsUrl, {
        handshakeTimeout: this.timeout,
      });
      lsnr.addEventListener('open', (): void => {
        lsnr.close();
        resolve(true);
      });

      lsnr.onerror = (): void => resolve(false);
    });
  }

  /**
   * WebScoketリスナーを開く
   * 常時接続
   */
  async open(): Promise<void> {
    this._isAlwaysConnected = true;
    return new Promise<void>((resolve, reject) => {
      this._listener = new Websocket(this._wsUrl, {
        handshakeTimeout: this.timeout,
      });

      /**
       * メッセージ受信時
       * @param ev メッセージイベント
       * @returns none
       */
      this._listener.onmessage = (ev: Websocket.MessageEvent): void => {
        const data = JSON.parse(ev.data.toString());
        if (data.uid && this._uid !== data.uid) {
          this._uid = data.uid;
          console.log('uuid: ' + this._uid);
          for (const key of Object.keys(this._functionMap)) {
            this._listener!.send(
              JSON.stringify({
                subscribe: key,
                uid: this._uid,
              })
            );
          }

          resolve();
        } else if (this._functionMap.has(data.topic)) {
          const func = this._functionMap.get(data.topic)!;
          func(data.data);
        }
      };

      /**
       * エラー時
       * @param ev イベント
       */
      this._listener.onerror = (ev: Websocket.ErrorEvent) => {
        console.error(ev);
        reject();
      };

      /**
       * クローズ時
       * @param ev クローズイベント
       */
      this._listener.addEventListener('close', async () => {
        console.log('onClose');
        this._uid = '';
        if (this._isAlwaysConnected) {
          this.open();
          console.log(`reopen: ${this._listener!.url}`);
        } else {
          this._functionMap = new Map<string, (arg: object) => void>();
        }
      });
    });
  }

  /**
   * 承認トランザクション通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerConfirmed(address: string, callback: (arg: Confirmed) => void) {
    const channelName =
      this._listenerChannelName.confirmedAdded + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * 連署通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerCosignature(address: string, callback: (arg: Cosignature) => void) {
    const channelName = this._listenerChannelName.cosignature + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * ファイナライズ通知
   * @param callback コールバック
   */
  registerFinalizedBlock(callback: (arg: FinalizedBlock) => void) {
    const channelName = this._listenerChannelName.finalizedBlock;
    if (!this._functionMap.has(channelName)) {
      // ブロック生成検知時の処理
      this.addCallback(channelName, callback as Callback);
      // ブロック生成検知設定
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * 新しいブロック通知
   * @param callback コールバック
   */
  registerNewBlock(callback: (arg: NewBlock) => void) {
    const channelName = this._listenerChannelName.newBlock;
    if (!this._functionMap.has(channelName)) {
      // ブロック生成検知時の処理
      this.addCallback(channelName, callback as Callback);
      // ブロック生成検知設定
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * パーシャル追加通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerPartialAdded(address: string, callback: (arg: PartialAdded) => void) {
    const channelName = this._listenerChannelName.partialAdded + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * パーシャル削除通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerPartialRemoved(
    address: string,
    callback: (arg: PartialRemoved) => void
  ) {
    const channelName =
      this._listenerChannelName.partialRemoved + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * トランザクションエラー通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerStatus(address: string, callback: (arg: ErrorStatus) => void) {
    const channelName = this._listenerChannelName.status + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * 未承認トランザクション追加通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerUnconfirmedAdded(
    address: string,
    callback: (arg: UnconfirmedAdded) => void
  ) {
    const channelName =
      this._listenerChannelName.unconfirmedAdded + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * 未承認トランザクション削除通知
   * @param address 通知対象アドレス
   * @param callback コールバック
   */
  registerUnconfirmedRemoved(
    address: string,
    callback: (arg: UnconfirmedRemoved) => void
  ) {
    const channelName =
      this._listenerChannelName.unconfirmedRemoved + '/' + address;
    if (!this._functionMap.has(channelName)) {
      this.addCallback(channelName, callback as Callback);
      this._listener!.send(
        JSON.stringify({
          subscribe: channelName,
          uid: this._uid,
        })
      );
    }
  }

  /**
   * チャンネルへコールバック追加
   * @param channel チャンネル
   * @param callback コールバック
   */
  private addCallback(channel: string, callback: (arg: object) => void): void {
    this._functionMap.set(channel, callback);
  }
}
