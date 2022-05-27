import {IAppContext, initialContext} from "./GlobalState";

<<<<<<< HEAD
type Action = {
    type: string
    payload?: any
}
const enum ACTIONS {
    UPDATE_VALUES= "UPDATE_VALUES",
=======
export type Action = {
    type: ActionTypes,
    newAddress: string
}

export enum ActionTypes {
    UpdateAddress
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
}

function reducer(state: IAppContext = initialContext , action: Action): IAppContext {
    switch(action.type) {
<<<<<<< HEAD
        case ACTIONS.UPDATE_VALUES:
            return {
                ...action.payload,
                ...state,
=======
        case ActionTypes.UpdateAddress:
            return {
                ...state,
                address: action.newAddress
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
            }
        default:
            return state;
    }
}

export default reducer;