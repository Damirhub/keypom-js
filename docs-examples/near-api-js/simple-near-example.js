const { initiateNearConnection, getFtCosts, estimateRequiredDeposit, ATTACHED_GAS_FROM_WALLET } = require("../utils/general");
const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { KeyPair } = require("near-api-js");

async function simpleDropNear(){
// Initiate connection to the NEAR blockchain.
console.log("Initiating NEAR connection");
let near = await initiateNearConnection('testnet');
const fundingAccount = await near.account('minqi.testnet');

// Keep track of an array of the key pairs we create and the public keys we pass into the contract
let keyPairs = [];
let pubKeys = [];
console.log("Creating keypairs");
// Generate keypairs and store them into the arrays defined above
let keyPair = await KeyPair.fromRandom('ed25519'); 
keyPairs.push(keyPair);   
pubKeys.push(keyPair.publicKey.toString());   

// Create drop with pub keys, deposit_per_use
// Note that the user is responsible for error checking when using NEAR-API-JS
// The SDK automatically does error checking; ensuring valid configurations, enough attached deposit, drop existence etc.
try {
	await fundingAccount.functionCall(
		'v1-3.keypom.testnet', 
		'create_drop', 
		{
			public_keys: pubKeys,
			deposit_per_use: parseNearAmount('1'),
		}, 
		"300000000000000",
		// Attached deposit of 1 $NEAR
		parseNearAmount("1"),
	);
} catch(e) {
	console.log('error creating drop: ', e);
}
}
simpleDropNear()