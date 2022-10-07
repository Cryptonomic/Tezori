import * as React from "react";
import {useContext, useState, useEffect} from "react";
import { Action, ActionTypes } from "../context/AppReducer";
import {GlobalContext} from "../context/GlobalState";
import { useSearchParams } from "react-router-dom";
import * as SearchParamUtils from "../utils/SearchParamUtils"

export function Settings() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [tezosServer, setTezosServer] = useState(globalState.tezosServer);
    const [apiKey, setApiKey] = useState(globalState.apiKey);
    const [network, setNetwork] = useState(globalState.network);
    const [derivationPath, setDerivationPath] = useState(globalState.network);
    const [address] = useState(globalState.address);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const handleSettingsUpdateClick = () => {
        const action: Action = {
            ...globalState,
            type: ActionTypes.UpdateSettings,
            tezosServer: tezosServer,
            apiKey: apiKey,
            network: network,
            address: address,
            derivationPath: derivationPath,
        }
        dispatch(action);
    }
    
    useEffect( () => {
        setSearchParams(
            SearchParamUtils.updateAddressQueryParams(
                searchParams.has("a"), 
                searchParams.get("a") as string, 
                globalState.address)
            )
    }, [globalState, setSearchParams, searchParams])
    
    return (
        <div id={"settings"}>
            <h1>Settings</h1>
            <p>Tezos Node</p>

            <input 
            id={"settings_tezosNode"} 
            defaultValue={globalState.tezosServer}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setTezosServer(e.currentTarget.value)}}
             />

            <p>Nautilus API Key</p>
            <input 
            id={"settings_apikey"} 
            defaultValue={globalState.apiKey}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setApiKey(e.currentTarget.value)}}
            />
            <p>Network</p>
            <input 
            id={"settings_network"} 
            defaultValue={globalState.network}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setNetwork(e.currentTarget.value)}}
            />
            <p>Derivation Path</p>
            <input 
            id={"settings_derivationPath"} 
            defaultValue={globalState.derivationPath}
            onChange={(e: React.FormEvent<HTMLInputElement>) => { setDerivationPath(e.currentTarget.value)}}
            />
            <p>
            <button onClick={() => handleSettingsUpdateClick()}>
                    Update
            </button>
            </p>
        </div>
    );
}