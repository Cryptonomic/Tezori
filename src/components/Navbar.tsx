import * as React from "react";
import {Link} from 'react-router-dom';
import '../styles/default.css';

export function Navbar() {
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
            </ul>
        </nav>
    )
}