import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function Gallery() {
    const {state } = useContext(GlobalContext);
    return (
        <div>
            <h1>Gallery</h1>
            <p>{state.address}</p>
        </div>
    );
}