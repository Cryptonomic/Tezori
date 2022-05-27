import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function AddressBar() {
    const {globalState } = useContext(GlobalContext);
    return (
        <div>
            <input id="address" defaultValue={globalState.address} />
            <button>Update</button>
        </div>
    );
}