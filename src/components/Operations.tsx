import React, {useState, useEffect} from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import {OperationKindType, TezosConseilClient} from "conseiljs";
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

    const onBeaconSend = async () => {
        if(val && address && globalState.isBeaconConnected) {
            const parsedAmount = tezToUtez(val);
            // const parsedFee = tezToUtez(val);
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
        }
    }

    const onBeaconDelegate = async () => {
        if(delegateAddress && globalState.isBeaconConnected) {
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
                <button className="operation-btn" disabled={!globalState.isBeaconConnected} onClick={() => onBeaconSend()}>Send</button>
            </div>
            <div className="label-container">
                <div className="operation-address">Baker Address</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={delegateAddress} onChange={e => setDelAddress(e.target.value)} />
                <button className="operation-delegate-btn" disabled={!globalState.isBeaconConnected} onClick={() => onBeaconDelegate()}>Delegate</button>
            </div>
            
        </div>
    );
}