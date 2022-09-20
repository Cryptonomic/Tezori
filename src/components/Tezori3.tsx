import * as React from "react";
import '../styles/default.css';
import {AddressBar} from "./AddressBar";
import {Settings} from "./Settings";
import {Wallet} from "./Wallet";
import {Gallery} from "./Gallery";
import {Navbar} from "./Navbar";
import Logger from "js-logger";
import {Navigate, Route, Routes} from 'react-router-dom';
import Operations from "./Operations";
import Sign from "./Sign";
import Verify from "./Verify";

export function Tezori3() {

    Logger.useDefaults();

    return (
        <div>
            <Navbar />
            <AddressBar />
                <main>
                    <Routes>
                            <Route path="/"         element={ <Navigate to="/gallery" /> } />
                            <Route path="/gallery"  element={<Gallery />} />
                            <Route path="/wallet"   element={<Wallet />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/operations" element={<Operations />} />
                            <Route path="/sign" element={<Sign />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="*" element={<Navigate to="/gallery" replace />} />
                    </Routes>
                </main>
        </div>
    )
}
