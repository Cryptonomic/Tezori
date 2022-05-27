import {IAppContext, initialContext} from "./GlobalState";

<<<<<<< HEAD
<<<<<<< HEAD
type Action = {
    type: string
    payload?: any
}
const enum ACTIONS {
    UPDATE_VALUES= "UPDATE_VALUES",
=======
=======
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
export type Action = {
    type: ActionTypes,
    newAddress: string
}

export enum ActionTypes {
    UpdateAddress
<<<<<<< HEAD
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
=======
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
}

function reducer(state: IAppContext = initialContext , action: Action): IAppContext {
    switch(action.type) {
<<<<<<< HEAD
<<<<<<< HEAD
        case ACTIONS.UPDATE_VALUES:
            return {
                ...action.payload,
                ...state,
=======
=======
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
        case ActionTypes.UpdateAddress:
            return {
                ...state,
                address: action.newAddress
<<<<<<< HEAD
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
=======
>>>>>>> fcd7724df8d264411be8054c3d3c2a7a00eaa7c4
            }
        default:
            return state;
    }
}

export default reducer;