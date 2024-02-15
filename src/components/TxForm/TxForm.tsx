import React, {useCallback, useState} from 'react';
import {Address} from '@ton/core';
import ReactJson from 'react-json-view';
import './style.scss';
import {createTransferBody} from '../TxComponents/MessageBuilder';
import {tryGetResult} from '../TxComponents/TxListener';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.

const JettonTransfer = createTransferBody();
const defaultTx: SendTransactionRequest = {
	// The transaction is valid for 10 minutes from now, in unix epoch seconds.
	validUntil: Math.floor(Date.now() / 1000) + 600,
	messages: [

		{
			// The receiver's address.
			address: Address.parse('EQAunkJ4YMGPxNLs6wdDt6Ge0ryShonsJ8tAZauh0unuLT4h').toString(),
			// Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
			amount: '70000000',
			// Payload for jetton transfer boc base64 format.
			payload: JettonTransfer.toBoc().toString("base64") ,
		},
	],
};

export function TxForm() {
	const [tx, setTx] = useState(defaultTx);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();
	const [flag, setFlag] = useState(false);

	async function handleSend(tx:SendTransactionRequest) {
		setFlag(true);
		const res = await tonConnectUi.sendTransaction(tx);
		const checkRes = await tryGetResult(res.boc);
		setFlag(false);
	}

	 function TextForm(props) { //copy text button from https://stackoverflow.com/questions/73134601/copy-text-button-function-in-react-js

		const [text, setText] = useState('');

		const handleCopy = () => {
			navigator.clipboard.writeText(text);
		}
		const handleOnChange = (event) =>{
			setText(event.target.value);
		}
		return (
			<>
				<div className='container'>
					<h1>{props.heading} </h1>
					<div className="mb-3">
            <textarea className="form-control"
					  value={text} id="myBox" rows="8" onChange={handleOnChange}></textarea>

						<button className="btn btn-primary mx-2 my-2" onClick={handleCopy}>Copy Text</button>

					</div>
				</div>
				<div className="container my-3">
					<h2>Your text summary</h2>
					<p>{text.split(" ").length} Word and {text.length} Characters</p>
					<p>{0.008 * text.split(" ").length} Minute Read</p>
					<h3>Preview</h3>
					<p>{text}</p>
				</div>
			</>
		)
	}


	const onChange = useCallback((value: object) => setTx((value as { updated_src: typeof defaultTx }).updated_src), []);

	return (
		<div className="send-tx-form">
			<h3>Configure and send transaction</h3>
			{
				flag ? <div>circle</div> : <div></div>
			}
			<ReactJson src={defaultTx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
			{wallet ? (
				<button onClick={() => handleSend(defaultTx) }>
					Send transaction
				</button>
			) : (
				<button onClick={() => tonConnectUi.openModal()}>Connect wallet to send the transaction</button>

			)}
			<button onClick={() => TextForm('txHash')}>tx link should appear here</button>
		</div>
	);
}
