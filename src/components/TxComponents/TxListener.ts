import {Address, TonClient, Cell, beginCell, storeMessage} from '@ton/ton';
import {Buffer} from "buffer";
import { sha256 } from '@ton/crypto';

export async function tryGetResult(exBoc: string): Promise<string> {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    const myAddress = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A'); // Address to fetch transactions from

    const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout after 30 seconds')), 30000));

    const searchPromise = new Promise<string>(async (resolve, reject) => {
        while (true) {
            const transactions = await client.getTransactions(myAddress, {
                limit: 5,
            });

            for (const tx of transactions) {
                const inMsg = tx.inMessage;
                if (inMsg?.info.type === 'external-in') {

                    const inBOC = inMsg?.body;
                    if (typeof inBOC === 'undefined') {

                        reject(new Error('Invalid external'));
                        return;
                    }
                    const extHash = Cell.fromBase64(exBoc).hash().toString('hex')
                    const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

                    console.log(' hash BOC', extHash);
                    console.log('inMsg hash', inHash );
                    console.log('checking the tx', tx, tx.hash().toString('hex'));


                    // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
                    if (extHash=== inHash) {
                        console.log('Tx match');
                        const txHash = tx.hash().toString('hex');
                        console.log(`Transaction Hash: ${txHash}`);
                        console.log(`Transaction LT: ${tx.lt}`);
                        resolve(txHash);
                        return;
                    }
                }
            }

            // Add a small delay here to prevent hammering the API too hard
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });

    return Promise.race([searchPromise, timeoutPromise]);
}