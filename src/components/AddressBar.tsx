import * as React from "react";
import {useContext, useState, useEffect} from "react";
import {GlobalContext} from "../context/GlobalState";
import {Action, ActionTypes} from "../context/AppReducer";
import * as TezosDomainUtils from "../utils/TezosDomainsUtils";
import { useSearchParams } from "react-router-dom";
import isElectron from 'is-electron';
import { KeyStoreUtils, LedgerSigner, TezosLedgerConnector } from "../utils/ledgerSigner";
import { KeyStoreCurve, KeyStoreType } from 'conseiljs';

export function AddressBar() {
    const {globalState, dispatch } = useContext(GlobalContext);
    const [address, setAddress] = useState(globalState.address);
    const [searchParams] = useSearchParams();

    const handleAddressUpdateClick = async () => {
        const isTezosAddress = address.startsWith("tz") || address.startsWith("KT")
        const addressFromTezosDomains = !isTezosAddress? await TezosDomainUtils.getAddressForTezosDomain(address, globalState.tezosServer, globalState.network) : null
        const updateAddress = !isTezosAddress && addressFromTezosDomains? addressFromTezosDomains : address
        const action: Action = {
            ...globalState,
            type: ActionTypes.UpdateAddress,
            address: updateAddress,
        }
        dispatch(action);
    }
    
    const getAddressFromLedger = async () => {
        console.log('aaaaaaa----')
        const identity = await KeyStoreUtils.unlockAddress(globalState.derivationPath);
        console.log('bbbbbb----', identity)
        if(identity.publicKeyHash) {
            setAddress(identity.publicKeyHash);
            const signer = new LedgerSigner(await TezosLedgerConnector.getInstance(), globalState.derivationPath);
            console.log('signer----', signer)
            const keyStore = {
                publicKey: identity.publicKey,
                secretKey: identity.secretKey,
                publicKeyHash: identity.publicKeyHash,
                curve: KeyStoreCurve.ED25519,
                seed: '',
                storeType: KeyStoreType.Hardware,
                derivationPath: globalState.derivationPath,
            };
            console.log('keyStore----', keyStore)
            const action: Action = {
                ...globalState,
                type: ActionTypes.UpdateLedgerStatus,
                address: identity.publicKeyHash,
                isLedgerConnected: true,
                signer,
                keyStore
            }
            dispatch(action);
        }
        

        // if(!ledgerInitialized) {
        //     const transport = await TransportWebHID.create()
        //     console.log("transport", transport)
        //     const appXtz = new Tezos(transport)
        //     console.log("appXtz", appXtz)
        //     setLedgerAppXtz(appXtz)
        //     setLedgerInitalized(true)
        // }

        // if(ledgerAppXtz) {
        //     const address = await ledgerAppXtz.getAddress(globalState.derivationPath)
        //     console.log("address", address)
        //     setAddress(address.address)
        // }
    }

    const getAddressFromBeacon = async () => {
        const dAppClient = globalState.beaconClient
        if(dAppClient) {
            const activeAccount = await dAppClient.getActiveAccount();
            let address = '';
            if (activeAccount) {
                address = activeAccount.address;
            } else {
                console.log("Requesting permissions...");
                const permissions = await dAppClient.requestPermissions();
                console.log("Got permissions:", permissions);
                address = permissions.address;
            }
            setAddress(address)
            const action = {
                type: ActionTypes.UpdateBeaconStatus,
                isBeaconConnected: true,
                address
            }
            dispatch(action);
        } else {
            throw ReferenceError("Beacon client not defined!")
        }
    }

    const onDisconnectBeacon = async () => {
        const dAppClient = globalState.beaconClient
        if(dAppClient) {
            await dAppClient.clearActiveAccount();
            const action = {
                type: ActionTypes.UpdateBeaconStatus,
                isBeaconConnected: false
            }
            dispatch(action);
        }
        else {
            throw ReferenceError("Beacon client not defined!")
        }
    }

    useEffect( () => {
        if(!globalState.isAddressInitialized) {
            if(searchParams.has("a")) {
                globalState.address = searchParams.get("a") as string
            }
            globalState.isAddressInitialized = true
        }
    }, [globalState, searchParams])

    useEffect( () => {
        setAddress(globalState.address)
    }, [globalState])

    useEffect( () => {
        const onCheckBeaconStatus = async () => {
            const dAppClient = globalState.beaconClient
            if(dAppClient) {
                const activeAccount = await dAppClient.getActiveAccount();
                if (activeAccount) {
                    const action = {
                        type: ActionTypes.UpdateBeaconStatus,
                        isBeaconConnected: true
                    }
                    dispatch(action);
                }
            }
        }
        onCheckBeaconStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <input
                id="address"
                value={address}
                onChange={(e: React.FormEvent<HTMLInputElement>) => { setAddress(e.currentTarget.value)}
            }
            />
            <button onClick={() => handleAddressUpdateClick()}>
                    Update
            </button>
            {!globalState.isMode && <button onClick={() => getAddressFromLedger()}>Get from Ledger</button>}
            {globalState.isMode && !globalState.isBeaconConnected && 
                <button
                    className="beacon-button"
                    disabled={isElectron()===true}
                    onClick={() => getAddressFromBeacon()}
                >
                    Connect Beacon
                </button>
            }
            {globalState.isMode && globalState.isBeaconConnected && 
                <button
                    className="beacon-button"
                    disabled={isElectron()===true}
                    onClick={() => onDisconnectBeacon()}
                >
                    Disconnect Beacon
                </button>
            }
        </div>
    );
}   
