# Sync Speed Checker

Symbolノードの同期時間差を下記のように簡易的に表示します。

```plaintext
    0ms: 1369240: 201-sai-dual.symboltest.net
  128ms: 1369240: 2.dusanjp.com
  317ms: 1369240: vmi1560137.contaboserver.net
  358ms: 1369240: sym-test-01.opening-line.jp
  363ms: 1369240: testnet1.symbol-mikun.net
 1672ms: 1369240: 6t.dusanjp.com
 2678ms: 1369240: 5t.dusanjp.com
 8729ms: 1369240: eolia.harvestasya.com
```

また、エラーステータスも監視します。

## 使用方法

### 監視するノードURLを設定

`hostlist.txt` に監視したいノードURLを入力します。

```plaintext
eolia.harvestasya.com
201-sai-dual.symboltest.net
5t.dusanjp.com
2.dusanjp.com
3t.dusanjp.com
6t.dusanjp.com
vmi1560137.contaboserver.net
testnet1.symbol-mikun.net
sym-test-01.opening-line.jp
```

### 実行

モジュールをインストール

```bash
yarn
```

実行

```bash
yarn start
```
