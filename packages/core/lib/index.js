"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNearAmount = exports.parseNearAmount = exports.wrapTxnParamsForTrial = exports.trialSignAndSendTxns = exports.trialCallMethod = exports.canExitTrial = exports.createTrialAccountDrop = exports.claimTrialAccountDrop = exports.deleteKeys = exports.addKeys = exports.nftTransferCall = exports.hashPassword = exports.getStorageBase = exports.getPubFromSecret = exports.getNFTMetadata = exports.getFTMetadata = exports.generateKeys = exports.ftTransferCall = exports.formatLinkdropUrl = exports.nearAPI = exports.estimateRequiredDeposit = exports.createNFTSeries = exports.accountExists = exports.updateKeypomContractId = exports.updateFunder = exports.supportedLinkdropClaimPages = exports.initKeypom = exports.getEnv = exports.execute = exports.deleteDrops = exports.createDrop = exports.claim = exports.withdrawBalance = exports.addToBalance = void 0;
var balances_1 = require("./lib/balances");
Object.defineProperty(exports, "addToBalance", { enumerable: true, get: function () { return balances_1.addToBalance; } });
Object.defineProperty(exports, "withdrawBalance", { enumerable: true, get: function () { return balances_1.withdrawBalance; } });
var claims_1 = require("./lib/claims");
Object.defineProperty(exports, "claim", { enumerable: true, get: function () { return claims_1.claim; } });
var drops_1 = require("./lib/drops");
Object.defineProperty(exports, "createDrop", { enumerable: true, get: function () { return drops_1.createDrop; } });
Object.defineProperty(exports, "deleteDrops", { enumerable: true, get: function () { return drops_1.deleteDrops; } });
var keypom_1 = require("./lib/keypom");
/** @group Utility */
Object.defineProperty(exports, "execute", { enumerable: true, get: function () { return keypom_1.execute; } });
Object.defineProperty(exports, "getEnv", { enumerable: true, get: function () { return keypom_1.getEnv; } });
Object.defineProperty(exports, "initKeypom", { enumerable: true, get: function () { return keypom_1.initKeypom; } });
Object.defineProperty(exports, "supportedLinkdropClaimPages", { enumerable: true, get: function () { return keypom_1.supportedLinkdropClaimPages; } });
Object.defineProperty(exports, "updateFunder", { enumerable: true, get: function () { return keypom_1.updateFunder; } });
Object.defineProperty(exports, "updateKeypomContractId", { enumerable: true, get: function () { return keypom_1.updateKeypomContractId; } });
var keypom_utils_1 = require("./lib/keypom-utils");
Object.defineProperty(exports, "accountExists", { enumerable: true, get: function () { return keypom_utils_1.accountExists; } });
Object.defineProperty(exports, "createNFTSeries", { enumerable: true, get: function () { return keypom_utils_1.createNFTSeries; } });
Object.defineProperty(exports, "estimateRequiredDeposit", { enumerable: true, get: function () { return keypom_utils_1.estimateRequiredDeposit; } });
Object.defineProperty(exports, "nearAPI", { enumerable: true, get: function () { return keypom_utils_1.exportedNearAPI; } });
Object.defineProperty(exports, "formatLinkdropUrl", { enumerable: true, get: function () { return keypom_utils_1.formatLinkdropUrl; } });
Object.defineProperty(exports, "ftTransferCall", { enumerable: true, get: function () { return keypom_utils_1.ftTransferCall; } });
Object.defineProperty(exports, "generateKeys", { enumerable: true, get: function () { return keypom_utils_1.generateKeys; } });
Object.defineProperty(exports, "getFTMetadata", { enumerable: true, get: function () { return keypom_utils_1.getFTMetadata; } });
Object.defineProperty(exports, "getNFTMetadata", { enumerable: true, get: function () { return keypom_utils_1.getNFTMetadata; } });
Object.defineProperty(exports, "getPubFromSecret", { enumerable: true, get: function () { return keypom_utils_1.getPubFromSecret; } });
Object.defineProperty(exports, "getStorageBase", { enumerable: true, get: function () { return keypom_utils_1.getStorageBase; } });
Object.defineProperty(exports, "hashPassword", { enumerable: true, get: function () { return keypom_utils_1.hashPassword; } });
Object.defineProperty(exports, "nftTransferCall", { enumerable: true, get: function () { return keypom_utils_1.nftTransferCall; } });
var keys_1 = require("./lib/keys");
Object.defineProperty(exports, "addKeys", { enumerable: true, get: function () { return keys_1.addKeys; } });
Object.defineProperty(exports, "deleteKeys", { enumerable: true, get: function () { return keys_1.deleteKeys; } });
__exportStar(require("./lib/sales"), exports);
var pre_trial_1 = require("./lib/trial-accounts/pre-trial");
Object.defineProperty(exports, "claimTrialAccountDrop", { enumerable: true, get: function () { return pre_trial_1.claimTrialAccountDrop; } });
Object.defineProperty(exports, "createTrialAccountDrop", { enumerable: true, get: function () { return pre_trial_1.createTrialAccountDrop; } });
var trial_active_1 = require("./lib/trial-accounts/trial-active");
Object.defineProperty(exports, "canExitTrial", { enumerable: true, get: function () { return trial_active_1.canExitTrial; } });
Object.defineProperty(exports, "trialCallMethod", { enumerable: true, get: function () { return trial_active_1.trialCallMethod; } });
Object.defineProperty(exports, "trialSignAndSendTxns", { enumerable: true, get: function () { return trial_active_1.trialSignAndSendTxns; } });
var utils_1 = require("./lib/trial-accounts/utils");
Object.defineProperty(exports, "wrapTxnParamsForTrial", { enumerable: true, get: function () { return utils_1.wrapTxnParamsForTrial; } });
__exportStar(require("./lib/types/drops"), exports);
__exportStar(require("./lib/types/fc"), exports);
__exportStar(require("./lib/types/ft"), exports);
__exportStar(require("./lib/types/general"), exports);
__exportStar(require("./lib/types/nft"), exports);
__exportStar(require("./lib/types/params"), exports);
__exportStar(require("./lib/types/protocol"), exports);
__exportStar(require("./lib/types/simple"), exports);
__exportStar(require("./lib/views"), exports);
const keypom_utils_2 = require("./lib/keypom-utils");
_a = keypom_utils_2.exportedNearAPI.utils.format, 
/** @group Utility */
exports.parseNearAmount = _a.parseNearAmount, 
/** @group Utility */
exports.formatNearAmount = _a.formatNearAmount;
