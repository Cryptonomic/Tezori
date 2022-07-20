import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Settings} from "./Settings";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";
import {Navbar} from "./Navbar";
import Logger from "js-logger";
import {Route, Routes, Navigate} from 'react-router-dom';

export function Tezori3() {

    Logger.useDefaults();

    return (
        <div>
            <Navbar />
            <AddressBar />
                <main>
                    <Routes>
                        <Route path="/Tezori/gallery"  element={<Gallery />}/>
                        <Route path="/Tezori/wallet"   element={<Wallet />}/>
                        <Route path="/Tezori/settings" element={<Settings />}/>
                        <Route path="*"          element={<Navigate to="Tezori/gallery" replace />} />
                    </Routes>
                </main>
        </div>
    )
}
