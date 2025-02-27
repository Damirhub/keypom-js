import { Account, Near } from "near-api-js";
import { FCData } from "./types/fc";
import { Funder } from "./types/general";
import { ProtocolReturnedDropConfig } from "./types/protocol";
export declare function isValidKeypomContract(keypomContractId: string): boolean;
export declare function isSupportedKeypomContract(keypomContractId: string): boolean;
export declare function isValidAccountObj(o: Account | undefined): o is Account;
export declare function isValidNearObject(o: Near): o is Near;
export declare function isValidFunderObject(o: Funder): o is Funder;
export declare const assert: (exp: any, m: any) => void;
export declare const assertValidDropConfig: (config?: ProtocolReturnedDropConfig) => void;
export declare const assertValidFCData: (fcData: FCData | undefined, depositPerUse: string, usesPerKey: number) => void;
export declare const assertDropIdUnique: (dropId: string) => Promise<void>;
