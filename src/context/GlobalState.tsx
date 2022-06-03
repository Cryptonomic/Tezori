import React, {createContext, useReducer, ReactElement} from 'react';
import AppReducer from './AppReducer';
import {DAppClient} from "@airgap/beacon-sdk";

export type IAppContext = {
    address: string;
    derivationPath: string;
    network: string;
    tezosServer: string;
    apiKey: string;
    beaconClient: DAppClient | null;
    children: ReactElement | null;
}

const initialContext: IAppContext = {
    address: "tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9",
    derivationPath: "44'/1729'/0'/0'/1'",
    network: "ithacanet",
    tezosServer: "https://tezos-ithaca.cryptonomic-infra.tech:443",
    apiKey: "ab682065-864a-4f11-bc77-0ef4e9493fa1",
    beaconClient: new DAppClient({name: "Tezori"}),
    children: null
}

export const GlobalContext = createContext<{
    globalState: IAppContext;
    dispatch: React.Dispatch<any>;
    }>({
        globalState: initialContext,
        dispatch: () => null
    });

export const GlobalProvider: React.FC<IAppContext> = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialContext);

    return (
        <GlobalContext.Provider value={{globalState: state, dispatch}}>
            {children}
        </GlobalContext.Provider>
    )
}