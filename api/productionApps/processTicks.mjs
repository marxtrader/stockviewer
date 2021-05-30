import { parentPort } from 'worker_threads'
import { getTicks } from '../functions/getTicks.mjs'

parentPort.on('message', async (eodInfo) => {
   const data = await getTicks(eodInfo.ticker, eodInfo.date)
    parentPort.postMessage(data)
});
