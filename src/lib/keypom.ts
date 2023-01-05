import * as nearAPI from "near-api-js";
const {
	Near,
	Account,
	KeyPair,
	keyStores: { BrowserLocalStorageKeyStore, InMemoryKeyStore },
} = nearAPI;

import { EnvVars, Funder, InitKeypomParams } from "./types";
import { parseSeedPhrase } from 'near-seed-phrase'
import {
	execute as _execute,
} from "./keypom-utils";

const gas = '200000000000000'
const gas300 = '300000000000000'
const attachedGas = '100000000000000'
const networks = {
	mainnet: {
		networkId: 'mainnet',
		viewAccountId: 'near',
		nodeUrl: 'https://rpc.mainnet.near.org',
		walletUrl: 'https://wallet.near.org',
		helperUrl: 'https://helper.mainnet.near.org'
	},
	testnet: {
		networkId: 'testnet',
		viewAccountId: 'testnet',
		nodeUrl: 'https://rpc.testnet.near.org',
		walletUrl: 'https://wallet.testnet.near.org',
		helperUrl: 'https://helper.testnet.near.org'
	}
}

let contractBase = 'v1-3.keypom'
let contractId = `${contractBase}.testnet`
let receiverId = contractId

let near, connection, keyStore, logger, networkId, fundingAccount, contractAccount, viewAccount, fundingKey;

/**
 * 
 * @returns {EnvVars} The environment variables used by the Keypom library.
 */
export const getEnv = (): EnvVars  => ({
	near, connection, keyStore, logger, networkId, fundingAccount, contractAccount, viewAccount, fundingKey,
	gas, gas300, attachedGas, contractId, receiverId, getAccount, execute,
})

export const execute = async (args) => _execute({ ...args, fundingAccount })

const getAccount = ({ account, wallet }) => account || wallet || fundingAccount

/**
 * Initializes the SDK to allow for interactions with the Keypom Protocol. By default, a new NEAR connection will be established but this can be overloaded by
 * passing in an existing connection object. In either case, if a funder is passed in, the credentials will be added to the keystore to sign transactions.
 * 
 * To update the funder account, refer to the `updateFunder` function. If you only wish to use view methods and not sign transactions, no funder account is needed.
 * If you wish to update the Keypom Contract ID being used, refer to the `updateKeypomContractId` function.
 * 
 * @param {Near} near (OPTIONAL) The NEAR connection instance to use. If not passed in, it will create a new one.
 * @param {string} network The network to connect to either `mainnet` or `testnet`.
 * @param {Funder=} funder (OPTIONAL) The account that will sign transactions to create drops and interact with the Keypom contract. This account will be added to the KeyStore if provided.
 * @param {string} keypomContractId The account ID of the Keypom contract. If not passed in, it will use the most up-to-date account ID for whichever network is selected.
 * 
 * @returns {Promise<Account | null>} If a funder is passed in, its account object is returned. Otherwise, it null is returned.
 * 
 * @example <caption>Using a pre-created NEAR connection instance with an UnencryptedFileSystemKeyStore:</caption>
 * ```js
 * const path = require("path");
 * const homedir = require("os").homedir();
 * const { KeyPair, keyStores, connect } = require("near-api-js");
 * const { initKeypom, getDrops } = require("keypom-js");
 * 
 * // Establish the network we wish to work on
 * const network = "testnet";
 * // Get the location where the credentials are stored for our KeyStore
 * const CREDENTIALS_DIR = ".near-credentials";
 * const credentialsPath = (await path).join(homedir, CREDENTIALS_DIR);
 * (await path).join;
 * let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
 *
 * // Establish the configuration for the connection
 * let nearConfig = {
 * 		networkId: network,
 * 		keyStore,
 * 		nodeUrl: `https://rpc.${network}.near.org`,
 * 		walletUrl: `https://wallet.${network}.near.org`,
 * 		helperUrl: `https://helper.${network}.near.org`,
 * 		explorerUrl: `https://explorer.${network}.near.org`,
 * };
 * // Connect to the NEAR blockchain and get the connection instance
 * let near = await connect(nearConfig);
 *
 * // Initialize the SDK for the given network and NEAR connection
 * await initKeypom({
 *		near,
 *		network
 * });
 * 
 * // Get the drops for the given owner
 * const dropsForOwner = await getDrops({accountId: "benjiman.testnet"});
 * ``` 
 * 
 * @example <caption>Creating an entirely new NEAR connection instance by using initKeypom and passing in a funder account:</caption>
 * ```js
 * const { initKeypom, getDrops } = require("keypom-js");
 * 
 * // Initialize the SDK for the given network and NEAR connection
 * await initKeypom({
 *		network: "testnet",
 *		funder: {
 *			accountId: "benji_demo.testnet",
 *			secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 *		}
 * });
 * 
 * // Get the drops for the given owner
 * const dropsForOwner = await getDrops({accountId: "benjiman.testnet"});
 * ``` 
*/
export const initKeypom = async ({
	near: _near,
	network,
	funder,
	keypomContractId,
}: InitKeypomParams) => {

	if (_near) {
		near = _near
		keyStore = near.config.keyStore
	} else {
		const networkConfig = typeof network === 'string' ? networks[network] : network
		keyStore = process?.versions?.node ? new InMemoryKeyStore() : new BrowserLocalStorageKeyStore()
		near = new Near({
			...networkConfig,
			deps: { keyStore },
		});
	}
	
	connection = near.connection;
	networkId = near.config.networkId

	if (networkId === 'mainnet') {
		contractId = receiverId = `${contractBase}.near`
	}

	if (keypomContractId) {
		contractId = receiverId = keypomContractId
	}

	viewAccount = new Account(connection, networks[networkId].viewAccountId)
	viewAccount.viewFunction2 = ({ contractId, methodName, args }) => viewAccount.viewFunction(contractId, methodName, args)

	contractAccount = new Account(connection, contractId)

	if (funder) {
		let { accountId, secretKey, seedPhrase } = funder
		if (seedPhrase) {
			secretKey = parseSeedPhrase(seedPhrase).secretKey
		}
		fundingKey = KeyPair.fromString(secretKey)
		await keyStore.setKey(networkId, accountId, fundingKey)
		fundingAccount = new Account(connection, accountId)
		fundingAccount.fundingKey = fundingKey
		return fundingAccount
	}

	return null
}

/**
 * Once the SDK is initialized, this function allows the current funder account to be updated. Having a funder is only necessary if you wish to sign transactions on the Keypom Protocol.
 * 
 * @param {Funder} funder The account that will sign transactions to create drops and interact with the Keypom contract. This account will be added to the KeyStore if provided.
 * 
 * @returns {Promise<Account>} The funder's account object is returned.
 * 
 * @example <caption>After initializing the SDK, the funder is updated.</caption>
 * ```js
 * const path = require("path");
 * const homedir = require("os").homedir();
 * const { KeyPair, keyStores, connect } = require("near-api-js");
 * const { initKeypom, updateFunder, getDrops } = require("keypom-js");
 * 
 *	// Initialize the SDK for the given network and NEAR connection
 *	await initKeypom({
 *		network: "testnet",
 *	});
 *
 *	// Update the current funder account
 *	await updateFunder({
 *		funder: {
 *			accountId: "benji_demo.testnet",
 *			secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 *		}
 *	})
 *
 *	// Get the drops for the given owner
 *	const dropsForOwner = await getDrops({accountId: "benjiman.testnet"});
 *	console.log('dropsForOwner: ', dropsForOwner)
 *
 *	return;
 * ``` 
*/
export const updateFunder = async ({
	funder
}:{funder: Funder}) => {

	if (near == undefined) {
		throw new Error("You must initialize the SDK via `initKeypom` before updating the funder account.");
	}

	let { accountId, secretKey, seedPhrase } = funder
	if (seedPhrase) {
		secretKey = parseSeedPhrase(seedPhrase).secretKey
	}
	fundingKey = KeyPair.fromString(secretKey)
	await keyStore.setKey(networkId, accountId, fundingKey)
	fundingAccount = new Account(connection, accountId)
	fundingAccount.fundingKey = fundingKey

	return null
}

/**
 * This allows the desired Keypom contract ID to be set. By default
 * 
 * @param {string} keypomContractId The account ID that should be used for the Keypom contract.
 * 
 * @example <caption>After initializing the SDK, the funder is updated.</caption>
 * ```js
 * const path = require("path");
 * const homedir = require("os").homedir();
 * const { KeyPair, keyStores, connect } = require("near-api-js");
 * const { initKeypom, updateFunder, getDrops } = require("keypom-js");
 * 
 *	// Initialize the SDK for the given network and NEAR connection
 *	await initKeypom({
 *		network: "testnet",
 *	});
 *
 *	// Update the current funder account
 *	await updateFunder({
 *		funder: {
 *			accountId: "benji_demo.testnet",
 *			secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 *		}
 *	})
 *
 *	// Get the drops for the given owner
 *	const dropsForOwner = await getDrops({accountId: "benjiman.testnet"});
 *	console.log('dropsForOwner: ', dropsForOwner)
 *
 *	return;
 * ``` 
*/
export const updateKeypomContractId = async ({
	keypomContractId
}:{keypomContractId: string}) => {

	if (near == undefined) {
		throw new Error("You must initialize the SDK via `initKeypom` before updating the funder account.");
	}

	let { accountId, secretKey, seedPhrase } = funder
	if (seedPhrase) {
		secretKey = parseSeedPhrase(seedPhrase).secretKey
	}
	fundingKey = KeyPair.fromString(secretKey)
	await keyStore.setKey(networkId, accountId, fundingKey)
	fundingAccount = new Account(connection, accountId)
	fundingAccount.fundingKey = fundingKey

	return null
}


