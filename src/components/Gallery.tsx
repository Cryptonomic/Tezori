import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    return (
        <div>
            <h1>Gallery</h1>
            <p>{globalState.address}</p>
        </div>
    );
}