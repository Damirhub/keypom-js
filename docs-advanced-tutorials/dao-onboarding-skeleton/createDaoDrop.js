const path = require("path");
const homedir = require("os").homedir();
const { KeyPair, keyStores, connect, Account } = require("near-api-js");
var assert = require('assert');

const keypom = require("keypom-js");
const { DEV_CONTRACT, DAO_BOT_CONTRACT } = require("./configurations");
const {
	initKeypom,
	getEnv,
	createDrop,
    parseNearAmount,
    formatLinkdropUrl,
} = keypom

// Change this to your account ID
const FUNDER_ACCOUNT_ID = "minqi.testnet";
const NETWORK_ID = "testnet";
async function createTickDrop() {

}

createTickDrop()

module.exports = {
    createTickDrop,
}
