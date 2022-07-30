import * as React from "react";
import {Link} from 'react-router-dom';
import '../styles/default.css';

export function Navbar() {
    return (
        <nav className="nav">
                <h1 className="text-3xl m-1">
      Hello world!
    </h1>

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
            </ul>
        </nav>
    )
}