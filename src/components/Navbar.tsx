import React, { useState, useContext } from "react";
import {Link} from 'react-router-dom';
import {GlobalContext} from "../context/GlobalState";
import { Action, ActionTypes } from "../context/AppReducer";
import '../styles/default.css';
import Toggle from 'react-toggle'

export function Navbar() {
    const {globalState, dispatch} = useContext(GlobalContext);

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const action: Action = {
            ...globalState,
            type: ActionTypes.UpdateMode,
            isMode: e.target.checked
        }
        dispatch(action);
    }
    return (
        <nav className="nav">
            <ul>
                <li>
                    <Link to="/gallery">Gallery</Link>
                </li>
                <li>
                    <Link to="/wallet">Wallet</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li>
                    <Link to="/operations">Operations</Link>
                </li>
                <li>
                    <Link to="/signverify">Sign & Verify</Link>
                </li>
            </ul>
            <label className="toggle-container">
                Ledger
                <Toggle
                    checked={globalState.isMode}
                    icons={false}
                    onChange={handleCheck} />
                <span>Beacon</span>
            </label>
        </nav>
    )
}