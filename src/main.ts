import { BlockInfo } from './BlockInfo.js';
import { Listener } from './infrastructure/Listener.js';
import { ErrorStatus } from './model/ErrorStatus.js';
import { NewBlock } from './model/NewBlock.js';
import * as fs from 'fs';
import * as readline from 'readline';

const blockInfo = new BlockInfo();

const rs = fs.createReadStream('hostlist.txt', 'utf-8');
const rl = readline.createInterface({ input: rs });

rl.on('line', async (nodeHost) => {
  const listener = new Listener(nodeHost);
  await listener.open();

  // 新ブロック監視
  listener.registerNewBlock((newBlock: NewBlock) => {
    if (blockInfo.blockHeight < newBlock.block.height) {
      blockInfo.blockHeight = newBlock.block.height;
      blockInfo.time = new Date();
    }
    const diff = new Date().getTime() - blockInfo.time.getTime();
    console.log(
      `${diff.toString().padStart(5, ' ')}ms: ${newBlock.block.height}: ${nodeHost}`
    );
  });

  // エラーステータス監視
  listener.registerStatus('', (status: ErrorStatus) => {
    console.log(`     ErrorStatus: ${status.code}: ${nodeHost}`);
  });
});
