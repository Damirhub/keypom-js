import * as nearAPI from "near-api-js";
const {
	Near,
	KeyPair,
	keyStores: { BrowserLocalStorageKeyStore },
	transactions: { addKey, deleteKey, functionCallAccessKey },
	utils,
	transactions: nearTransactions,
	utils: {
		PublicKey,
		format: { parseNearAmount, formatNearAmount },
	},
} = nearAPI;


import { BN } from "bn.js";
import { accountMappingContract, getEnv, updateKeypomContractId } from "../../keypom";
import { getKeyInformation } from "../../views";
import { isValidKeypomContract } from "../../checks";
import { trialCallMethod } from "../../trial-accounts/trial-active";
import { getPubFromSecret } from "../../keypom-utils";

export const KEYPOM_LOCAL_STORAGE_KEY = 'keypom-wallet-selector';

export const getLocalStorageKeypomEnv = () => {
	const localStorageDataJson = localStorage.getItem(`${KEYPOM_LOCAL_STORAGE_KEY}:envData`);
	return localStorageDataJson;
}

export const setLocalStorageKeypomEnv = (jsonData) => {
	const dataToWrite = JSON.stringify(jsonData);
	console.log('dataToWrite: ', dataToWrite)

	localStorage.setItem(`${KEYPOM_LOCAL_STORAGE_KEY}:envData`, dataToWrite);
}

export const getAccountFromMap = async (secretKey) => {
	const {viewCall} = getEnv();
	let pk = getPubFromSecret(secretKey);

	const accountId = await viewCall({
		contractId: accountMappingContract[getEnv().networkId!],
		methodName: 'get_account_id',
		args: {pk}
	})
	console.log('accountId found from map: ', accountId)
	
	return accountId
}

export const addUserToMappingContract = async (accountId, secretKey) => {
	const accountIdFromMapping = await getAccountFromMap(secretKey);

	if (accountIdFromMapping !== accountId) {
		console.log(`No Account ID found from mapping contract: ${JSON.stringify(accountIdFromMapping)} Adding now.`);
		trialCallMethod({
			trialAccountId: accountId,
			trialAccountSecretKey: secretKey,
			contractId: accountMappingContract[getEnv().networkId!],
			methodName: 'set',
			args: {},
			attachedDeposit: parseNearAmount('0.002')!,
			attachedGas: '10000000000000'
		});
	}

	return accountIdFromMapping !== accountId
}

export const updateKeypomContractIfValid = (keypomContractId) => {
	if (isValidKeypomContract(keypomContractId) === true) {
		updateKeypomContractId({
			keypomContractId
		})

		return true;
	}

	return false;
}
