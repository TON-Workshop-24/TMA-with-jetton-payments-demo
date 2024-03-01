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
export async function tryProcessJetton(exBoc: string): Promise<string> {
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

        const myAddress = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A'); // Address to fetch transactions from
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
           // }
}



        const init = async () => {
            await prepare();

            const Transactions = await Subscription();
            for (const tx of Transactions) {


                const onTransaction = async (tx : Transaction) => {

                    const sourceAddress = tx.inMessage?.info.src;
                    if (!sourceAddress) {
                        // external message - not related to jettons
                        return;
                    }

                    if (!(sourceAddress instanceof Address)) {
                        return;
                    }

                    const in_msg = tx.inMessage;

                    if (in_msg?.info.type !== 'internal') {
                        // external message - not related to jettons
                        return;
                    }

                    const jettonName = jettonWalletAddressToJettonName(sourceAddress);
                    if (!jettonName) {
                        // unknown or fake jetton transfer
                        return;
                    }
                }



                    if (!in_msg?.data ||
                        tx.in_msg.msg_data['@type'] !== 'msg.dataRaw' ||
                        !tx.in_msg.msg_data.body
                    ) {
                        // no in_msg or in_msg body
                        return;
                    }

                    /// msg_reader
                    const inMsg = tx.inMessage;
                    if (inMsg?.info.type === 'external-in') {

                        const inBOC = inMsg?.body;
                        if (typeof inBOC === 'undefined') {

                            reject(new Error('Invalid external'));
                            return;
                        }
                        const extHash = Cell.fromBase64(exBoc).hash().toString('hex')
                        const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

                    /// msg_reader

                    const msgBod = tx.inMessage

                    const msgBody = TonWeb.utils.base64ToBytes(tx.in_msg.msg_data.body);

                    const cell = TonWeb.boc.Cell.oneFromBoc(msgBody);
                    const slice = cell.beginParse();
                    const op = slice.loadUint(32);
                    if (!op.eq(new TonWeb.utils.BN(0x7362d09c))) return; // op == transfer_notification
                    const queryId = slice.loadUint(64);
                    const amount = slice.loadCoins();
                    const from = slice.loadAddress();
                    const maybeRef = slice.loadBit();
                    const payload = maybeRef ? slice.loadRef() : slice;
                    const payloadOp = payload.loadUint(32);
                    if (!payloadOp.eq(new TonWeb.utils.BN(0))) {
                        console.log('no text comment in transfer_notification');
                        return;
                    }
                    const payloadBytes = payload.loadBits(slice.getFreeBits());
                    const comment = new TextDecoder().decode(payloadBytes);
                    console.log('Got ' + jettonName + ' jetton deposit ' + amount.toString() + ' units with text comment "' + comment + '"');
                }

            }

            const accountSubscription = new AccountSubscription(tonweb, MY_WALLET_ADDRESS, 0, onTransaction);
            await accountSubscription.start();
        }

        init();

}
