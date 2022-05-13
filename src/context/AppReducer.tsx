import {IAppContext} from "./GlobalState";

type Action = {
    type: string
}

function reducer(state: IAppContext, action: Action): IAppContext {
    switch(action.type) {
        default:
            return state;
    }
}

export default reducer;