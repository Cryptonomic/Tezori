import * as React from "react";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Action, ActionTypes} from "../context/AppReducer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Tezos from "@ledgerhq/hw-app-tezos";

export function AddressBar() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [address, setAddress] = useState(globalState.address);

    const handleAddressUpdateClick = () => {
        const action: Action = {
            type: ActionTypes.UpdateAddress,
            newAddress: address
        }
        dispatch(action);
    }

    const getAddressFromLedger = async () => {
        //trying to connect to your Ledger device with HID protocol
        const transport = await TransportWebHID.create()
        console.log("transport", transport)
        const appXtz = new Tezos(transport)
        console.log("appXtz", appXtz)
        const address = await appXtz.getAddress("44'/1729'/0'/0'")
        console.log("address", address)
    }

    return (
        <div>
            <input
                id="address"
                defaultValue={address}
                onChange={(e: React.FormEvent<HTMLInputElement>) => { setAddress(e.currentTarget.value)}
            }
            />
            <button
                onClick={() => handleAddressUpdateClick()}
            >
                    Update
            </button>
            <button onClick={() => getAddressFromLedger()}>Get from Ledger</button>
        </div>
    );
}