import React, {useState, useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import { ConseilDataClient, ConseilQueryBuilder, ConseilOperator } from 'conseiljs';
import { SigningType } from '@airgap/beacon-sdk';
import { KeyStoreUtils } from 'conseiljs-softsigner';


export default function SignVerify() {
    const {globalState } = useContext(GlobalContext);
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [vMessage, setVMessage] = useState('');
    const [vSignature, setVSignature] = useState('');
    const [pkh, setPkh] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const onSign = async () => {
        if(message) {
            if(globalState.isBeaconConnected) {
                const response = await globalState.beaconClient?.requestSignPayload({
                    signingType: SigningType.RAW,
                    payload: message,
                });
                
                console.log(`Signature: ${response?.signature}`);
                setSignature(response?.signature || '');
            } else {
                const signature = await globalState.signer?.signText(message);
                setSignature(signature || '');
            }
            
        }
    }

    const onVerify = async () => {
        if(message && signature && pkh) {
            let publicKey = '';
            if (pkh.startsWith('edpk') && pkh.length === 54) {
                publicKey = pkh;
            } else {
                let publicKeyQuery = ConseilQueryBuilder.blankQuery();
                publicKeyQuery = ConseilQueryBuilder.addFields(publicKeyQuery, 'public_key');
                publicKeyQuery = ConseilQueryBuilder.addPredicate(publicKeyQuery, 'kind', ConseilOperator.EQ, ['reveal'], false);
                publicKeyQuery = ConseilQueryBuilder.addPredicate(publicKeyQuery, 'status', ConseilOperator.EQ, ['applied'], false);
                publicKeyQuery = ConseilQueryBuilder.addPredicate(publicKeyQuery, 'source', ConseilOperator.EQ, [pkh], false);
                publicKeyQuery = ConseilQueryBuilder.setLimit(publicKeyQuery, 1);
                const serverInfo = {
                    url: globalState.conseilUrl,
                    apiKey: globalState.apiKey,
                    network: globalState.network
                };
                publicKey = (await ConseilDataClient.executeEntityQuery(serverInfo, 'tezos', globalState.network, 'operations', publicKeyQuery))[0]?.public_key;
                console.log('publicKey---', publicKey);
            }

            const isVerify = await KeyStoreUtils.checkTextSignature(vSignature, vMessage, publicKey);
            setIsVerified(isVerify);
        }
    }

    return (
        <div className="operations">
            <h1>Sign</h1>
            <div className="label-container">
                <div className="operation-address">Message</div>
            </div>
            <div className="operation-container">
                <textarea className="operation-address" rows={3} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div className="operation-container">
                <button className="verify-btn" disabled={!globalState.isBeaconConnected && !globalState.isLedgerConnected} onClick={() => onSign()}>Sign</button>
            </div>
            <p>Signature: {signature}</p>
            <h1>Verify</h1>
            <div className="label-container">
                <div className="operation-address">Message</div>
            </div>
            <div className="operation-container">
                <textarea className="operation-address" rows={3} value={vMessage} onChange={e => setVMessage(e.target.value)} />
            </div>
            <div className="label-container">
                <div className="operation-address">Signature</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={vSignature} onChange={e => setVSignature(e.target.value)} />
            </div>
            <div className="label-container">
                <div className="operation-address">Signer address or public key</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={pkh} onChange={e => setPkh(e.target.value)} />
            </div>
            <div className="operation-container">
                Status: {isVerified.toString()}
            </div>
            <div className="operation-container">
                <button className="verify-btn" disabled={!globalState.isBeaconConnected && !globalState.isLedgerConnected} onClick={() => onVerify()}>Verify</button>
            </div>
        </div>
    );
}