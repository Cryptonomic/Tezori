import React from 'react';
import {IAppContext} from "./GlobalState";

type Action = {
    type: string
}

export default (state: IAppContext, action: Action): IAppContext => {
    switch(action.type) {
        default:
            return state;
    }
}