import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Settings} from "./Settings";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";

export function Tezori3() {
    return (
        <div>
            <AddressBar />
            <div>
                <Wallet />
                <Gallery/>
                <Settings />
            </div>
        </div>
    )
}