import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function AddressBar() {
    const {state } = useContext(GlobalContext);
    return (
        <div>
            <input id="address" defaultValue={state.address} />
            <button>Update</button>
        </div>
    );
}