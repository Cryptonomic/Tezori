import {IAppContext} from "./GlobalState";
import Logger from "js-logger";
import { LedgerSigner } from '../utils/ledgerSigner';
import { KeyStore } from 'conseiljs';

export type Action = {
    type: ActionTypes,
    address: string,
    tezosServer: string,
    apiKey: string,
    network: string,
    derivationPath: string,
    isBeaconConnected: boolean,
    isLedgerConnected: boolean,
    isMode: boolean,
    signer: LedgerSigner | null,
    keyStore: KeyStore | null
}

export enum ActionTypes {
    UpdateAddress,
    UpdateSettings,
    UpdateBeaconStatus,
    UpdateMode,
    UpdateLedgerStatus,
}

function reducer(state: IAppContext, action: Action): IAppContext {
    switch(action.type) {
        case ActionTypes.UpdateAddress:
        {
            Logger.info("Reducer processed UpdateAddress action.")
            return {
                ...state,
                address: action.address
            }
        }
        case ActionTypes.UpdateSettings: {
            Logger.info("Reducer processed UpdateAddress action.")
            return {
                ...state,
                tezosServer: action.tezosServer,
                apiKey: action.apiKey,
                network: action.network,
                derivationPath: action.derivationPath,
            }
        }
        case ActionTypes.UpdateBeaconStatus: {
            Logger.info("Reducer processed UpdateBeaconStatus action.")
            return {
                ...state,
                isBeaconConnected: action.isBeaconConnected,
                address: action.address
            }
        }
        case ActionTypes.UpdateMode: {
            Logger.info("Reducer processed UpdateMode action.")
            return {
                ...state,
                isMode: action.isMode
            }
        }
        case ActionTypes.UpdateLedgerStatus: {
            Logger.info("Reducer processed UpdateBeaconStatus action.")
            return {
                ...state,
                isLedgerConnected: action.isLedgerConnected,
                address: action.address,
                signer: action.signer,
                keyStore: action.keyStore
            }
        }
        default: {
            Logger.warn("Reducer encountered an unknown state")
            return state;
        }
    }
}

export default reducer;
