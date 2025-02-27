import { InstantLinkWallet, NetworkId, Transaction } from "@near-wallet-selector/core";
import BN from "bn.js";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { BeginTrialCustomizations, InsufficientBalanceCustomizations, InvalidActionCustomizations, OffboardingWallet, TrialOverCustomizations } from "../modal/src/lib/modal.types";
import { KeypomWallet } from "./wallet";
export declare const FAILED_EXECUTION_OUTCOME: FinalExecutionOutcome;
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
    keypomWallet: KeypomWallet;
}
export interface KeypomParams {
    networkId: NetworkId;
    signInContractId: string;
    trialBaseUrl: string;
    iconUrl?: string;
    deprecated?: boolean;
    trialSplitDelim?: string;
    modalOptions?: {
        wallets: OffboardingWallet[];
        beginTrial?: BeginTrialCustomizations;
        trialOver?: TrialOverCustomizations;
        invalidAction?: InvalidActionCustomizations;
        insufficientBalance?: InsufficientBalanceCustomizations;
    };
}
export type KeypomWalletInstant = InstantLinkWallet & {
    networkId: string;
    getContractId(): string;
    switchAccount(id: string): Promise<void>;
    getAccountId(): string;
    isSignedIn: () => Promise<boolean>;
    getAvailableBalance: () => Promise<BN>;
    showModal(): any;
};
