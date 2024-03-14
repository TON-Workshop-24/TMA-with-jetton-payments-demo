// Copy from the https://docs.ton.org/develop/dapps/ton-connect/message-builders#jetton-transfer

import {Address, beginCell, toNano} from '@ton/ton'
// transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
// response_destination:MsgAddress custom_payload:(Maybe ^Cell)
// forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
// = InternalMsgBody;

export function createTransferBody(orderId:string) {
    const Wallet_SRC = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A');

    const jettonWalletAddress = Address.parse('EQAunkJ4YMGPxNLs6wdDt6Ge0ryShonsJ8tAZauh0unuLT4h');
    const destinationAddress = Address.parse('UQCFv_2OqxdVm4IFOps-XCkW6xeug49b9FTyk8fbI-cIuj3A');

    const forwardPayload = beginCell()
        .storeUint(0, 32) // 0 opcode means we have a comment
        .storeStringTail(orderId)
        .endCell();

    const messageBody = beginCell()
        .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
        .storeUint(0, 64) // query id
        .storeCoins(1000000) // jetton amount, amount * 10^9
        .storeAddress(destinationAddress)
        .storeAddress(destinationAddress) // response destination
        .storeBit(0) // no custom payload
        .storeCoins(toNano('0.02')) // forward amount
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forwardPayload)
        .endCell();

    return messageBody;
}
