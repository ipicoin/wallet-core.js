/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import Models from "../models";

import { readFile } from "fs/promises";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, GasPrice } from "@cosmjs/stargate";

const BLANK_MESSAGE_NOTE = `NO_MESSAGE_INCLUDED by wallet-core.js (UNIXUSAT=${Date.now()})`;

async function sendAmount(
	fromWallet,
	toAddress,
	tokenAmount,
	chainConfig,
	message = BLANK_MESSAGE_NOTE,
	feeCalc = "auto",
) {
	if (Models.check(fromWallet, "is-wallet")) {
	}

	const [firstAccount] = await fromWallet.walletHook.getAccounts();

	const amountToSend = {
		denom: config.denom,
		tokenAmount,
	};

	const result = await client.sendTokens(
		firstAccount.address,
		recipient,
		[amountToSend],
		"auto", // that was broken
		message,
	);
	console.log("Transaction Hash:", result.transactionHash);
}

export default sendAmount;
