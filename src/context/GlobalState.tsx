import React, {createContext, useReducer, ReactElement} from 'react';
import AppReducer from './AppReducer';
import {DAppClient} from "@airgap/beacon-sdk";
import { LedgerSigner } from '../utils/ledgerSigner';
import { KeyStore } from 'conseiljs';

export type IAppContext = {
    address: string;
    derivationPath: string;
    network: string;
    tezosServer: string;
    apiKey: string;
    beaconClient: DAppClient | null;
    children: ReactElement | null;
    isAddressInitialized: boolean;
    conseilUrl: string;
    isBeaconConnected: boolean;
    isLedgerConnected: boolean;
    isMode: boolean;
    signer: LedgerSigner | null;
    keyStore: KeyStore | null
}
// mainnet
const initialContext: IAppContext = {
    address: "",
    derivationPath: "44'/1729'/0'/0'/1'",
    network: "mainnet",
    tezosServer: "https://tezos-prod.cryptonomic-infra.tech:443",
    apiKey: "galleon",
    beaconClient: new DAppClient({name: "Tezori"}),
    children: null,
    isAddressInitialized: false,
    conseilUrl: 'https://conseil-prod.cryptonomic-infra.tech:443',
    isBeaconConnected: false,
    isLedgerConnected: false,
    isMode: false,
    signer: null,
    keyStore: null
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
