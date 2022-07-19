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
    isAddressInitialized: boolean
}

const initialContext: IAppContext = {
    address: "tz1Z2Ne4ZHxNPuCJeCcoykHVXTqhVdLMD9gV",
    derivationPath: "44'/1729'/0'/0'/1'",
    network: "mainnet",
    tezosServer: "https://tezos-prod.cryptonomic-infra.tech:443",
    apiKey: "ab682065-864a-4f11-bc77-0ef4e9493fa1",
    beaconClient: new DAppClient({name: "Tezori"}),
    children: null,
    isAddressInitialized: false
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
