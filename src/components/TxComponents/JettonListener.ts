import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';
import {TupleReader} from '@ton/core';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A'; // your HOT wallet

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];
            if (jetton.jettonWalletAddress.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe

    const Subscription = async ():Promise<Transaction[]> =>{

        const client = new TonClient({
            endpoint: 'https://toncenter.com/api/v2/jsonRPC',
            apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
        });

        const myAddress = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }



    const init = async () => {
        await prepare();

        const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout after 30 seconds')), 30000));
        const searchPromise = new Promise<string>(async (resolve, reject) => {

            while (true) {

                const Transactions = await Subscription();
                for (const tx of Transactions) {

                    console.log('current transaction', tx.hash().toString('hex'));

                    const sourceAddress = tx.inMessage?.info.src;
                    if (!sourceAddress) {
                        // external message - not related to jettons
                        continue;
                    }

                    console.log('source Address check passed', tx.hash().toString('hex'));

                    if (!(sourceAddress instanceof Address)) {
                        continue;
                    }

                    console.log('source Address instance check passed', tx.hash().toString('hex'));

                    const in_msg = tx.inMessage;

                    if (in_msg?.info.type !== 'internal') {
                        // external message - not related to jettons
                        continue;
                    }

                    console.log('internal type check', tx.hash().toString('hex'));

                    // const jettonName = jettonWalletAddressToJettonName(sourceAddress);
                    // if (!jettonName) {
                    //     // unknown or fake jetton transfer
                    //     continue;
                    // }

                    console.log('jetton Name passed', tx.hash().toString('hex'));

                    if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                        // no in_msg or in_msg body
                        continue;
                    }

                    console.log('msg body', tx.hash().toString('hex'));

                    const msgBody = tx.inMessage;
                    const sender = tx.inMessage?.info.src;
                    const originalBody = tx.inMessage?.body.beginParse();
                    let body = originalBody?.clone();
                    const op = body?.loadUint(32);

                    console.log('op code =', op);

                    if (!(op == 0x7362d09c))
                    {
                        continue; // op == transfer_notification
                    }

                    console.log('op code check passed', tx.hash().toString('hex'));

                    const queryId = body?.loadUint(64);
                    const amount = body?.loadCoins();
                    const from = body?.loadAddress();
                    const maybeRef = body?.loadBit();
                    const payload = maybeRef ? body?.loadRef().beginParse() : body;
                    const payloadOp = payload?.loadUint(32);
                    if (!(payloadOp == 0)) {
                        console.log('no text comment in transfer_notification');
                        continue;
                    }

                    const comment = payload?.loadStringTail();
                    if (!(comment == orderId)) {
                        continue;
                    }
                    // jettonName
                    console.log('Got ' + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
                    const txHash = tx.hash().toString('hex');
                    resolve(txHash);
                    return;
                }

                // Add a small delay here to prevent hammering the API too hard
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        });
        return Promise.race([searchPromise, timeoutPromise]);
    }
    init();
}





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
                    console.log('inMsg hash', inHash);
                    console.log('checking the tx', tx, tx.hash().toString('hex'));




                    // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
                    if (extHash === inHash) {
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


