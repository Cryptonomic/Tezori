import {IAppContext} from "./GlobalState";

export type Action = {
    type: ActionTypes,
    newAddress: string
}

export enum ActionTypes {
    UpdateAddress
}

function reducer(state: IAppContext, action: Action): IAppContext {
    switch(action.type) {
        case ActionTypes.UpdateAddress:
            return {
                ...state,
                address: action.newAddress
            }
        default:
            return state;
    }
}

export default reducer;