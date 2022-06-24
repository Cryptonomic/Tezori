import * as React from "react";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Action, ActionTypes} from "../context/AppReducer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Tezos from "@ledgerhq/hw-app-tezos";

export function AddressBar() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [address, setAddress] = useState(globalState.address);
    const [ledgerInitialized, setLedgerInitalized] = useState(false);
    const [ledgerAppXtz, setLedgerAppXtz] = useState<Tezos>();

    const handleAddressUpdateClick = () => {
        const action: Action = {
            type: ActionTypes.UpdateSettings,
            newTezosServer: globalState.tezosServer,
            newApiKey: globalState.apiKey,
            newNetwork: globalState.network,
            newDerivationPath: globalState.derivationPath,
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
            const address = await ledgerAppXtz.getAddress(globalState.derivationPath)
            console.log("address", address)
            setAddress(address.address)
        }
    }

    const getAddressFromBeacon = async () => {
        const dAppClient = globalState.beaconClient
        if(dAppClient) {
            const activeAccount = await dAppClient.getActiveAccount();
            if (activeAccount) {
                setAddress(activeAccount.address)
            }
            else
            {
                console.log("Requesting permissions...");
                const permissions = await dAppClient.requestPermissions();
                console.log("Got permissions:", permissions);
                setAddress(permissions.address)
            }
        }
        else {
            throw ReferenceError("Beacon client not defined!")
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
            <button onClick={() => getAddressFromBeacon()}>Get from Beacon</button>
        </div>
    );
}