import {Link} from 'react-router-dom';
import Logo from "../assets/images/Logo.png"

export function Navbar() {
    return (
        <nav className="nav p-5">
            <img className="inline" src={Logo} alt="logo" />
            <ul>
                <li className="font-extrabold">
                    <Link to="/gallery">About us</Link>
                </li>
                <li>
                    <Link to="/gallery">Contact us</Link>
                </li>
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