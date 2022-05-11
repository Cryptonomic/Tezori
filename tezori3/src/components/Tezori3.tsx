import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";
import {Settings} from "./Settings";

export function Tezori3() {
    return (
        <body>
            <AddressBar defaultAddress={"t1wtfbbq"} />
            <div>
                <Settings />
            </div>
        </body>
    )
}