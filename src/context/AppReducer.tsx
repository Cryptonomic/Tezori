import {IAppContext} from "./GlobalState";

export type Action = {
    type: ActionTypes,
    newAddress: string,
    newTezosServer: string,
    newApiKey: string,
    newNetwork: string,
}

export enum ActionTypes {
    UpdateAddress,
    UpdateSettings
}
 
function reducer(state: IAppContext, action: Action): IAppContext {
    switch(action.type) {
        case ActionTypes.UpdateAddress:
            return {
                ...state,
                address: action.newAddress
            }
        case ActionTypes.UpdateSettings:
            return {
                ...state,
                tezosServer: action.newTezosServer,
                apiKey: action.newApiKey,
                network: action.newNetwork,                
            }
        default:
            return state;
    }
}

export default reducer;