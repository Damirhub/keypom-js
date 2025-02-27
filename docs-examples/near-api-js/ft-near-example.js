const { parseNearAmount, formatNearAmount } = require("near-api-js/lib/utils/format");
const { KeyPair, keyStores, connect } = require("near-api-js");
const { getRecentDropId } = require("../utils/general.js")
const path = require("path");
const homedir = require("os").homedir();
const { BN } = require("bn.js");


async function ftDropNear(){
	// Initiate connection to the NEAR testnet blockchain.
	const network = "testnet"
	const CREDENTIALS_DIR = ".near-credentials";
	const credentialsPath =  path.join(homedir, CREDENTIALS_DIR);
	const YOUR_ACCOUNT = "keypom-docs-demo.testnet";
	const FT_CONTRACT = "ft.keypom.testnet";
	const KEYPOM_CONTRACT = "v2.keypom.testnet";

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
	const fundingAccount = await near.account(YOUR_ACCOUNT);

	// Get amount of FTs to transfer. In this scenario, we've assumed it to be 1 for one single use key.
	let amountToTransfer = parseNearAmount("1")
	let funderFungibleTokenBal = await fundingAccount.viewFunction(
		FT_CONTRACT, 
		'ft_balance_of',
		{
			account_id: YOUR_ACCOUNT
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
			KEYPOM_CONTRACT, 
			'create_drop', 
			{
				public_keys: pubKeys,
				deposit_per_use: parseNearAmount("1"),
				ft: {
					contract_id: FT_CONTRACT,
					sender_id: YOUR_ACCOUNT,
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
			FT_CONTRACT, 
			'storage_deposit',
			{
				account_id: YOUR_ACCOUNT,
			},
			"300000000000000",
			// We are using 0.1 $NEAR to pay the storage deposit to include our account ID in their registered list of users. 
			// Realistically, this will be more than enough and will be refunded the excess
			parseNearAmount("0.1")
		);

		// Get the drop ID of the drop that we just created. This is for the message in the NFT transfer
		let dropId = await getRecentDropId(fundingAccount, YOUR_ACCOUNT, KEYPOM_CONTRACT);
		
		console.log(dropId)
		await fundingAccount.functionCall(
			FT_CONTRACT, 
			'ft_transfer_call', 
			{
				receiver_id: KEYPOM_CONTRACT,
				amount: (amountToTransfer.toString()),				
				msg: dropId.toString()
			},
			"300000000000000",
			// Attached deposit of 0.1 $NEAR
			"1"
		);
	} catch(e) {
		console.log('error sending FTs', e);
	}
	var dropInfo = {};
    	// Creating list of pk's and linkdrops; copied from orignal simple-create.js
    	for(var i = 0; i < keyPairs.length; i++) {
		// For keyPairs.length > 1, change URL secret key to keyPair.secretKey[i]
	    let linkdropUrl = `https://wallet.testnet.near.org/linkdrop/${KEYPOM_CONTRACT}/${keyPair.secretKey}`;
	    dropInfo[pubKeys[i]] = linkdropUrl;
	}
	// Write file of all pk's and their respective linkdrops
	console.log('Public Keys and Linkdrops: ', dropInfo)
	console.log(`Keypom Contract Explorer Link: explorer.${network}.near.org/accounts/${KEYPOM_CONTRACT}.com`)
}
ftDropNear()