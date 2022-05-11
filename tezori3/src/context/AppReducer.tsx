import React from 'react';
import {IAppContext} from "./GlobalState";

type Action = {
    type: string
}

export default (state: IAppContext, action: Action): IAppContext => {
    switch(action.type) {
        /*case 'ADD_ITEM':
            return {
                shoppingList: [action.payload, ...state.shoppingList]
            }
        case 'REMOVE_ITEM':
            return {
                shoppingList: state.shoppingList.filter(item => item !== action.payload)
            }*/
        default:
            return state;
    }
}