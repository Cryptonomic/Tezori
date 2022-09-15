import {IAppContext} from "./GlobalState";
import Logger from "js-logger";

export type Action = {
    type: ActionTypes,
    newAddress: string,
    newTezosServer: string,
    newApiKey: string,
    newNetwork: string,
    newDerivationPath: string,
    isBeaconConnected: boolean
}

export enum ActionTypes {
    UpdateAddress,
    UpdateSettings,
    UpdateBeaconStatus
}

function reducer(state: IAppContext, action: Action): IAppContext {
    Logger.info("REDUCER: \nState:\n" + JSON.stringify(state), "\nAction:\n" + JSON.stringify(action))
    switch(action.type) {
        case ActionTypes.UpdateAddress:
        {
            Logger.info("Reducer processed UpdateAddress action.")
            return {
                ...state,
                address: action.newAddress
            }
        }
        case ActionTypes.UpdateSettings: {
            Logger.info("Reducer processed UpdateAddress action.")
            return {
                ...state,
                tezosServer: action.newTezosServer,
                apiKey: action.newApiKey,
                network: action.newNetwork,
                derivationPath: action.newDerivationPath,
            }
        }
        case ActionTypes.UpdateBeaconStatus: {
            Logger.info("Reducer processed UpdateBeaconStatus action.")
            return {
                ...state,
                isBeaconConnected: action.isBeaconConnected
            }
        }
        default: {
            Logger.warn("Reducer encountered an unknown state")
            return state;
        }
    }
}

export default reducer;
