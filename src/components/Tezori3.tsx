import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Settings} from "./Settings";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";
import {Navbar} from "./Navbar";
import Logger from "js-logger";
import {Route, Routes} from 'react-router-dom';

export function Tezori3() {

    Logger.useDefaults();

    return (
        <div>
            <Navbar />
            <AddressBar />
                <main>
                    <Routes>
                            <Route path="/"         element={<Gallery />} />
                            <Route path="/gallery"  element={<Gallery />} />
                            <Route path="/wallet"   element={<Wallet />} />
                            <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
        </div>
    )
}
