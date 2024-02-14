import {Address, TonClient, beginCell, fromNano, Transaction} from '@ton/ton';

export async function tryGetResult( exBoc : string)  {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: '1b312c91c3b691255130350a49ac5a0742454725f910756aff94dfe44858388e',
    });

    const myAddress = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A'); // address that you want to fetch transactions from
    const transactions = await client.getTransactions(myAddress, {
        limit: 5,
    });

    for (const tx of transactions) {
        const inMsg = tx.inMessage;

        if (inMsg?.info.type = 'external') {

            const sender = inMsg?.info.src;
            const value = inMsg?.info.value.coins;

            //const originalBody = inMsg?.body.beginParse();
            const inboc = inMsg?.body;

            if (typeof(inboc) == 'undefined') {
                throw new Error('Invalid external');
            }

            if (inboc.hash().toString('hex') == exBoc) {
                console.log('Tx match');
                console.log(`Transaction Hash: ${tx.hash().toString('hex')}`);
                console.log(`Transaction LT: ${tx.lt}`);
                console.log();

                return tx;
            }

        }
    }
}
