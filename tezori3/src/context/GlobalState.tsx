import {createContext, useReducer, ReactElement} from 'react';
import AppReducer from './AppReducer';

export type IAppContext = {
    address: string;
    derivationPath: string;
    network: string;
    tezosServer: string;
    apiKey: string;
    children: ReactElement | null;
}

const initialContext: IAppContext = {
    address: "tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9",
    derivationPath: "1/1/1/1/",
    network: "ithacanet",
    tezosServer: "https://tezos-ithaca.cryptonomic-infra.tech:443",
    apiKey: "ab682065-864a-4f11-bc77-0ef4e9493fa1",
    children: null
}

export const GlobalContext = createContext<{
    state: IAppContext;
    dispatch: React.Dispatch<any>;
    }>({
        state: initialContext,
        dispatch: () => null
    });

export const GlobalProvider: React.FC<IAppContext> = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialContext);

    // Actions for changing state

    /*function addItemToList(item) {
        dispatch({
            type: 'ADD_ITEM',
            payload: item
        });
    }
    function removeItemFromList(item) {
        dispatch({
            type: 'REMOVE_ITEM',
            payload: item
        });
    }*/

    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            {children}
        </GlobalContext.Provider>
    )
}