import React, {useState} from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import { char2Bytes } from '@taquito/utils';
import { SigningType } from '@airgap/beacon-sdk';


export default function Sign() {
    const {globalState } = useContext(GlobalContext);
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');

    const onSign = async () => {
        if(message && globalState.isBeaconConnected) {
            const bytes = char2Bytes(message);
            const length = bytes.length > 100 ? bytes.length.toString() : '100';
            const payloadBytes = '050100' + char2Bytes(length) + bytes;
            const response = await globalState.beaconClient?.requestSignPayload({
                signingType: SigningType.MICHELINE,
                payload:payloadBytes
              });
            
            console.log(`Signature: ${response?.signature}`);
            setSignature(response?.signature || '');
        }
    }

    return (
        <div className="operations">
            <h1>Sign</h1>
            <div className="label-container">
                <div className="operation-address">Message</div>
            </div>
            <div className="operation-container">
                <textarea className="operation-address" rows={5} value={message} onChange={e => setMessage(e.target.value)} />
                <button className="sign-btn" disabled={!globalState.isBeaconConnected} onClick={() => onSign()}>Sign</button>
            </div>
            <p>{signature}</p>
        </div>
    );
}