import {IAppContext, initialContext} from "./GlobalState";

type Action = {
    type: string
    payload?: any
}
const enum ACTIONS {
    UPDATE_VALUES= "UPDATE_VALUES",
}

function reducer(state: IAppContext = initialContext , action: Action): IAppContext {
    switch(action.type) {
        case ACTIONS.UPDATE_VALUES:
            return {
                ...action.payload,
                ...state,
            }
        default:
            return state;
    }
}

export default reducer;