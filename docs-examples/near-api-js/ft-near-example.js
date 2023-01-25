const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { KeyPair, keyStores, connect } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();
const { BN } = require("bn.js");


async function ftDropNear(){
	// Initiate connection to the NEAR testnet blockchain.
	const network = "testnet"
	const CREDENTIALS_DIR = ".near-credentials";
	const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);

	let keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

	let nearConfig = {
		networkId: network,
		keyStore: keyStore,
		nodeUrl: `https://rpc.${network}.near.org`,
		walletUrl: `https://wallet.${network}.near.org`,
		helperUrl: `https://helper.${network}.near.org`,
		explorerUrl: `https://explorer.${network}.near.org`,
	};

	let near = await connect(nearConfig);
	const fundingAccount = await near.account("keypom-docs-demo.testnet");

	// Get amount of FTs to transfer. In this scenario, we've assumed it to be 1 for one single use key.
	let amountToTransfer = parseNearAmount("1")
	let funderFungibleTokenBal = await fundingAccount.viewFunction(
		"ft.keypom.testnet", 
		'ft_balance_of',
		{
			account_id: "keypom-docs-demo.testnet"
		}
	);

	// Check if the owner has enough FT balance to fund drop
	if (new BN(funderFungibleTokenBal).lte(new BN(amountToTransfer))){
		throw new Error('funder does not have enough Fungible Tokens for this drop. Top up and try again.');
	}

	// Keep track of an array of the keyPairs we create and public keys to pass into the contract
	let keyPairs = [];
	let pubKeys = [];
	// Generate keypairs and store them in the arrays defined above
	let keyPair = await KeyPair.fromRandom('ed25519'); 
	keyPairs.push(keyPair);   
	pubKeys.push(keyPair.publicKey.toString());   

	// Create drop with FT data
	// Note that the user is responsible for error checking when using NEAR-API-JS
	// The SDK automatically does error checking; ensuring valid configurations, enough attached deposit, drop existence etc.
	try {
		await fundingAccount.functionCall(
			"v1-3.keypom.testnet", 
			'create_drop', 
			{
				public_keys: pubKeys,
				deposit_per_use: parseNearAmount("1"),
				ft: {
					contract_id: "ft.keypom.testnet",
					sender_id: "keypom-docs-demo.testnet",
					// This balance per use is balance of FTs per use. 
					// parseNearAmount is used for conveience to convert to 10^24
					balance_per_use: parseNearAmount("1")
				}
			}, 
			"300000000000000",
			// Attached deposit of 1.5 $NEAR
			parseNearAmount("1.5")
		);
	} catch(e) {
		console.log('error creating drop: ', e);
	}

	// Pay storage deposit and trasnfer FTs to Keypom contract.
	try {
		await fundingAccount.functionCall(
			FT_CONTRACT_ID, 
			'storage_deposit',
			{
				account_id: "keypom-docs-demo.testnet",
			},
			"300000000000000",
			// We are using 0.1 $NEAR to pay the storage deposit to include our account ID in their registered list of users. 
			// Realistically, this will be more than enough and will be refunded the excess
			parseNearAmount("0.1")
		);

		// Get the drop ID of the drop that we just created. This is for the message in the NFT transfer
		let dropId = await getRecentDropId(fundingAccount, "keypom-docs-demo.testnet", "v1-3.keypom.testnet");

		await fundingAccount.functionCall(
			"ft.keypom.testnet", 
			'ft_transfer_call', 
			{
				receiver_id: "v1-3.keypom.testnet",
				amount: parseNearAmount((amountToTransfer.toString())),				
				msg: dropId.toString()
			},
			"300000000000000",
			// Attached deposit of 0.1 $NEAR
			parseNearAmount("0.1")
		);
	} catch(e) {
		console.log('error sending FTs', e);
	}
}
ftDropNear()