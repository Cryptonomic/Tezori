import React, {useState, useEffect} from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import { OperationKindType, TezosConseilClient, TezosNodeWriter, KeyStore, Signer, BabylonDelegationHelper } from 'conseiljs';
import { tezToUtez } from '../utils/currency';
import { TezosOperationType } from "@airgap/beacon-sdk";


interface AverageFees {
    low: number;
    medium: number;
    high: number;
}

const AVERAGEFEES: AverageFees = {
    low: 1420,
    medium: 2840,
    high: 5680
};

export default function Operations() {
    const {globalState } = useContext(GlobalContext);
    const [val, setVal] = useState('');
    const [address, setAddress] = useState('');
    const [delegateAddress, setDelAddress] = useState('');
    const [fee, setFee] = useState(AVERAGEFEES.high);

    useEffect(() => {
        const fetchFee = async () => {
            const serverFees = await TezosConseilClient.getFeeStatistics(
                { url: globalState.conseilUrl, apiKey: globalState.apiKey, network: globalState.network }, globalState.network, OperationKindType.Transaction
            ).catch(() => [
                AVERAGEFEES,
            ]);

            console.log('feeee', serverFees);

            setFee(serverFees[0].high);
        }

        fetchFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeVal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value)
    }

    const onSend = async () => {
        if(val && address) {
            const parsedAmount = tezToUtez(val);
            if(globalState.isMode) {
                const response = await globalState.beaconClient?.requestOperation({
                    operationDetails: [
                    {
                        kind: TezosOperationType.TRANSACTION,
                        destination: address,
                        amount: String(parsedAmount),
                    },
                    ],
                });
                console.log("Operation Hash: ", response?.transactionHash);
            } else {
                const res: any = await TezosNodeWriter.sendTransactionOperation(
                    globalState.tezosServer,
                    globalState.signer as Signer,
                    globalState.keyStore as KeyStore,
                    address,
                    parsedAmount,
                    fee
                ).catch((err: any) => {
                    const errorObj = { name: err.message, ...err };
                    console.error(errorObj);
                    return false;
                });

                console.log('ledger send----', res)
            }
            
        }
    }

    const onDelegate = async () => {
        if(delegateAddress) {
            if(globalState.isMode) {
                const response = await globalState.beaconClient?.requestOperation({
                    operationDetails: [
                    {
                        kind: TezosOperationType.DELEGATION,
                        delegate: delegateAddress,
                        fee: String(fee)
                    },
                    ],
                });
                console.log("Operation Hash: ", response?.transactionHash);
            } else {
                const res = await BabylonDelegationHelper.setDelegate(
                    globalState.tezosServer,
                    globalState.signer as Signer,
                    globalState.keyStore as KeyStore,
                    globalState.address,
                    delegateAddress,
                    fee
                ).catch((err: any) => {
                    const errorObj = { name: err.message, ...err };
                    console.error(errorObj);
                    return false;
                });
                console.log('ledger delegate----', res)
            }
        }

    }
    return (
        <div className="operations">
            <h1>Operations</h1>
            <div className="label-container">
                <div className="operation-address">Recipient Address</div>
                <div className="operation-amount">Amount</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={address} onChange={e => setAddress(e.target.value)} />
                <input className="operation-amount" type='number' value={val} onChange={onChangeVal} />
                <button className="operation-btn" disabled={!globalState.isBeaconConnected && !globalState.isLedgerConnected} onClick={() => onSend()}>Send</button>
            </div>
            <div className="label-container">
                <div className="operation-address">Baker Address</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={delegateAddress} onChange={e => setDelAddress(e.target.value)} />
                <button className="operation-delegate-btn" disabled={!globalState.isBeaconConnected && !globalState.isLedgerConnected} onClick={() => onDelegate()}>Delegate</button>
            </div>
            
        </div>
    );
}