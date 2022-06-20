import * as React from "react";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Action, ActionTypes} from "../context/AppReducer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Tezos from "@ledgerhq/hw-app-tezos";

export function AddressBar() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [address, setAddress] = useState(globalState.address);
    const [tezosServer] = useState(globalState.tezosServer);
    const [apiKey] = useState(globalState.apiKey);
    const [network] = useState(globalState.network);
    const [ledgerInitialized, setLedgerInitalized] = useState(false);
    const [ledgerAppXtz, setLedgerAppXtz] = useState<Tezos>();

    const handleAddressUpdateClick = () => {
        const action: Action = {
            type: ActionTypes.UpdateSettings,
            newTezosServer: tezosServer,
            newApiKey: apiKey,
            newNetwork: network,
            newAddress: address
        }
        dispatch(action);
    }

    const getAddressFromLedger = async () => {

        if(!ledgerInitialized) {
            const transport = await TransportWebHID.create()
            console.log("transport", transport)
            const appXtz = new Tezos(transport)
            console.log("appXtz", appXtz)
            setLedgerAppXtz(appXtz)
            setLedgerInitalized(true)
        }

        if(ledgerAppXtz) {
            const address = await ledgerAppXtz.getAddress("44'/1729'/0'/0'")
            console.log("address", address)
            setAddress(address.address)
        }
    }

    return (
        <div>
            <input
                id="address"
                value={address}
                onChange={(e: React.FormEvent<HTMLInputElement>) => { setAddress(e.currentTarget.value)}
            }
            />
            <button onClick={() => handleAddressUpdateClick()}>
                    Update
            </button>
            <button onClick={() => getAddressFromLedger()}>Get from Ledger</button>
        </div>
    );
}