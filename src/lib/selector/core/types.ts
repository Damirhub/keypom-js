import { InstantLinkWallet, NetworkId, Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { KeypomWallet } from "./wallet";

export const FAILED_EXECUTION_OUTCOME: FinalExecutionOutcome = {
    status: {
        Failure: {
            error_message: "Invalid Trial Action",
            error_type: "keypom-trial-error"
        }
    },
    transaction: {},
    transaction_outcome: {
        id: "",
        outcome: {
            logs: [],
            receipt_ids: [],
            gas_burnt: 0,
            status: {
                Failure: {
                    error_message: "Invalid Trial Action",
                    error_type: "keypom-trial-error"
                }
            },
        }
    },
    receipts_outcome: [{
        id: "",
        outcome: {
            logs: [],
            receipt_ids: [],
            gas_burnt: 0,
            status: {
                Failure: {
                    error_message: "Invalid Trial Action",
                    error_type: "keypom-trial-error"
                }
            },
        }
    }]
}

export interface SignInOptions {
    contractId?: string;
    allowance?: string;
    methodNames?: string[];
}

export declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface SignAndSendTransactionsParams {
    transactions: Array<Optional<Transaction, "signerId">>;
}

export interface KeypomInitializeOptions {
    keypomWallet: KeypomWallet
}

export interface KeypomParams {
    networkId: NetworkId;
    signInContractId: string;
    iconUrl?: string;
    deprecated?: boolean;
    trialBaseUrl?: string;
    trialSplitDelim?: string;
    modalOptions?: any;
}

export type KeypomWalletInstant = InstantLinkWallet & {
    networkId: string;
    getContractId(): string;
    switchAccount(id: string): Promise<void>;
    getAccountId(): string;
    isSignedIn: () => Promise<boolean>;
    getAvailableBalance: () => Promise<BN>;
    showModal();
};