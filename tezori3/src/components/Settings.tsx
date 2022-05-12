import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function Settings() {
    const {state } = useContext(GlobalContext);
    return (
        <div>
            <h1>{state.network}</h1>
        </div>
    );
}