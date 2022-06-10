import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Settings} from "./Settings";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";
import Logger from "js-logger";

export function Tezori3() {

    Logger.useDefaults();

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