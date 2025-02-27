import * as nearAPI from "near-api-js";
import { BrowserWalletBehaviour, Wallet } from '@near-wallet-selector/core/lib/wallet/wallet.types';
import { Account } from "near-api-js";
import { ProtocolReturnedDrop } from './types/protocol';
import { CreateOrAddReturn } from './types/params';
type AnyWallet = BrowserWalletBehaviour | Wallet;
/**
 * Add keys that are manually generated and passed in, or automatically generated to an existing drop. If they're
 * automatically generated, they can be based off a set of entropy. For NFT and FT drops, assets can automatically be sent to Keypom to register keys as part of the payload.
 * The deposit is estimated based on parameters that are passed in and the transaction can be returned instead of signed and sent to the network. This can allow you to get the
 * required deposit from the return value and use that to fund the account's Keypom balance to avoid multiple transactions being signed in the case of a drop with many keys.
 *
 * @return {Promise<CreateOrAddReturn>} Object containing: the drop ID, the responses of the execution, as well as any auto generated keys (if any).
 *
 * @example
 * Create a basic empty simple drop and add 10 keys. Each key is completely random:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. No entropy passed in so any auto generated keys will
 * // be completely random unless otherwise overwritten.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create an empty simple drop with no keys.
 * const {dropId} = await createDrop({
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Add 10 completely random keys. The return value `keys` contains information about the generated keys
 * const {keys} = await addKeys({
 * 	dropId,
 * 	numKeys: 10
 * })
 *
 * console.log('public keys: ', keys.publicKeys);
 * console.log('private keys: ', keys.secretKeys);
 * ```
 *
 * @example
 * Init funder with root entropy, create empty drop and add generate deterministic keys. Compare with manually generated keys:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. Root entropy is passed into the funder account so any generated keys
 * // Will be based off that entropy.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1",
 * 		rootEntropy: "my-global-secret-password"
 * 	}
 * });
 *
 * // Create a simple drop with no keys
 * const { dropId } = await createDrop({
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Add 5 keys to the empty simple drop. Each key will be derived based on the rootEntropy of the funder, the drop ID, and key nonce.
 * const {keys: keysFromDrop} = await addKeys({
 * 	dropId,
 * 	numKeys: 5
 * })
 *
 * // Deterministically Generate the Private Keys:
 * const nonceDropIdMeta = Array.from({length: 5}, (_, i) => `${dropId}_${i}`);
 * const manualKeys = await generateKeys({
 * 	numKeys: 5,
 * 	rootEntropy: "my-global-secret-password",
 * 	metaEntropy: nonceDropIdMeta
 * })
 *
 * // Get the public and private keys from the keys generated by addKeys
 * const {publicKeys, secretKeys} = keysFromDrop;
 * // Get the public and private keys from the keys that were manually generated
 * const {publicKeys: pubKeysGenerated, secretKeys: secretKeysGenerated} = manualKeys;
 * // These should match!
 * console.log('secretKeys: ', secretKeys)
 * console.log('secretKeysGenerated: ', secretKeysGenerated)
 *
 * // These should match!
 * console.log('publicKeys: ', publicKeys)
 * console.log('pubKeysGenerated: ', pubKeysGenerated)
 * ```
 *
 * @example
 * Create an empty drop and add manually created keys:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection. No entropy passed in so any auto generated keys will
 * // be completely random unless otherwise overwritten.
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create an empty simple drop using the keys that were generated. Since keys are passed in, the return value won't contain information about the keys.
 * const {dropId} = await createDrop({
 * 	publicKeys,
 * 	depositPerUseNEAR: 1,
 * });
 *
 * // Generate 10 random keys
 * const {publicKeys} = await generateKeys({
 * 	numKeys: 10
 * });
 *
 * // Add keys to the drop using the keys that were generated. Since keys are passed in, the return value won't contain information about the keys.
 * await addKeys({
 * 	publicKeys,
 * 	dropId
 * })
 * ```
 * @group Creating, And Claiming Drops
*/
export declare const addKeys: ({ account, wallet, dropId, drop, numKeys, publicKeys, nftTokenIds, rootEntropy, basePassword, passwordProtectedUses, extraDepositNEAR, extraDepositYocto, useBalance, returnTransactions }: {
    /** Account object that if passed in, will be used to sign the txn instead of the funder account. */
    account?: nearAPI.Account | undefined;
    /** If using a browser wallet through wallet selector and that wallet should sign the transaction, pass in the object. */
    wallet?: AnyWallet | undefined;
    /**
     * Specify how many keys should be generated for the drop. If the funder has rootEntropy set OR rootEntropy is passed in, the keys will be
     * deterministically generated using the drop ID, key nonce, and entropy. Otherwise, each key will be generated randomly.
    */
    numKeys: number;
    /** Pass in a custom set of publicKeys to add to the drop. If this is not passed in, keys will be generated based on the numKeys parameter. */
    publicKeys?: string[] | undefined;
    /**  Specify the drop ID for which you want to add keys to. */
    dropId?: string | undefined;
    /** If the drop information from getDropInformation is already known to the client, it can be passed in instead of the drop ID to reduce computation. */
    drop?: ProtocolReturnedDrop | undefined;
    /**
     * If the drop type is an NFT drop, the token IDs can be passed in so that the tokens are automatically sent to the Keypom contract rather
     * than having to do two separate transactions. A maximum of 2 token IDs can be sent during the `addKeys` function. To send more token IDs in
     * order to register key uses, use the `nftTransferCall` function.
     */
    nftTokenIds?: string[] | undefined;
    /** Specify an entropy to use for generating keys (will overload the funder's rootEntropy if applicable). This parameter only matters if the publicKeys variable is not passed in. */
    rootEntropy?: string | undefined;
    /** For doing password protected drops, this is the base password that will be used to generate all the passwords. It will be double hashed with the public keys. If specified, by default, all key uses will have their own unique password unless passwordProtectedUses is passed in. */
    basePassword?: string | undefined;
    /** For doing password protected drops, specifies exactly which uses will be password protected. The uses are NOT zero indexed (i.e 1st use = 1). Each use will have a different, unique password generated via double hashing the base password + public key + key use. */
    passwordProtectedUses?: number[] | undefined;
    /** For Public Sales, drops might require an additional fee for adding keys. This specifies the amount of $NEAR in human readable format (i.e `1.5` = 1.5 $NEAR) */
    extraDepositNEAR?: number | undefined;
    /** For Public Sales, drops might require an additional fee for adding keys. This specifies the amount of $NEAR in yoctoNEAR (i.e `1` = 1 $yoctoNEAR = 1e-24 $NEAR) */
    extraDepositYocto?: string | undefined;
    /** If the account has a balance within the Keypom contract, set this to true to avoid the need to attach a deposit. If the account doesn't have enough balance, an error will throw. */
    useBalance?: boolean | undefined;
    /** If true, the transaction will be returned instead of being signed and sent. This is useful for getting the requiredDeposit from the return value without actually signing the transaction. */
    returnTransactions?: boolean | undefined;
}) => Promise<CreateOrAddReturn>;
/**
 * Delete a set of keys from a drop and optionally withdraw any remaining balance you have on the Keypom contract.
 *
 * @example
 * Create a drop with 5 keys and delete the first one:
 * ```js
 * // Initialize the SDK for the given network and NEAR connection
 * await initKeypom({
 * 	network: "testnet",
 * 	funder: {
 * 		accountId: "benji_demo.testnet",
 * 		secretKey: "ed25519:5yARProkcALbxaSQ66aYZMSBPWL9uPBmkoQGjV3oi2ddQDMh1teMAbz7jqNV9oVyMy7kZNREjYvWPqjcA6LW9Jb1"
 * 	}
 * });
 *
 * // Create the simple drop with 5 random keys
 * const {keys, dropId} = await createDrop({
 * 	numKeys: 5,
 * 	depositPerUseNEAR: 1,
 * });
 *
 * await deleteKeys({
 * 	dropId,
 * 	publicKeys: keys.publicKeys[0] // Can be wrapped in an array as well
 * })
 * ```
 * @group Deleting State
*/
export declare const deleteKeys: ({ account, wallet, publicKeys, dropId, withdrawBalance }: {
    /** Account object that if passed in, will be used to sign the txn instead of the funder account. */
    account?: nearAPI.Account | undefined;
    /** If using a browser wallet through wallet selector and that wallet should sign the transaction, pass in the object. */
    wallet?: AnyWallet | undefined;
    /** Specify a set of public keys to delete. If deleting a single publicKey, the string can be passed in without wrapping it in an array. */
    publicKeys: string[] | string;
    /** Which drop ID do the keys belong to? */
    dropId: string;
    /** Whether or not to withdraw any remaining balance on the Keypom contract. */
    withdrawBalance?: boolean | undefined;
}) => Promise<any>;
export {};
