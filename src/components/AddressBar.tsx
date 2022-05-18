import * as React from "react";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Action, ActionTypes} from "../context/AppReducer";

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
        </div>
    );
}