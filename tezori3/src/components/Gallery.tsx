import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function Gallery() {
    const {state } = useContext(GlobalContext);
    return (
        <p>{state.address}</p>
    );
}