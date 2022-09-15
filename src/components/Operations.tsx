import React, {useState, useEffect} from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import {OperationKindType, TezosConseilClient, TezosMessageUtils, TezosNodeWriter, BabylonDelegationHelper} from "conseiljs";
import { SoftSigner } from 'conseiljs-softsigner';
import { TestKeyStore } from '../constants/testAssets';
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
    const [fee, setFee] = useState(0);
    const [signer, setSigner] = useState<any>(null);

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

        const onGenerateKeys = async () => {
            const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(TestKeyStore.secretKey, 'edsk'), '');
            console.log('signer', signer);
            setSigner(signer);
        }

        fetchFee();
        onGenerateKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeVal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value)
    }

    const onSend = async () => {
        if(signer && val && address) {
            const decryptSigner = await SoftSigner.createSigner(await signer.getKey(''));
            const parsedAmount = tezToUtez(val);
            const res: any = await TezosNodeWriter.sendTransactionOperation(
                globalState.tezosServer,
                decryptSigner,
                TestKeyStore,
                address,
                parsedAmount,
                fee
            ).catch((err) => {
                const errorObj = { name: err.message, ...err };
                console.error(errorObj);
                return false;
            });

            console.log('res-----', res)
        }
    }

    const onBeaconSend = async () => {
        if(val && address) {
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
    const onDelegate = async () => {
        if(signer && delegateAddress) {
            const decryptSigner = await SoftSigner.createSigner(await signer.getKey(''));
            const res = await BabylonDelegationHelper.setDelegate(
                globalState.tezosServer,
                decryptSigner,
                TestKeyStore,
                globalState.address,
                delegateAddress,
                fee
            ).catch((err) => {
                const errorObj = { name: err.message, ...err };
                console.error(errorObj);
                return false;
            });

            console.log('delegate-----', res)
        }
    }

    const onBeaconDelegate = async () => {
        if(delegateAddress) {
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
                <button className="operation-btn" onClick={() => onSend()}>Send</button>
                {globalState.isBeaconConnected && <button className="operation-beacon-btn" onClick={() => onBeaconSend()}>Send via Beacon</button>}
            </div>
            <div className="label-container">
                <div className="operation-address">Baker Address</div>
            </div>
            <div className="operation-container">
                <input className="operation-address" value={delegateAddress} onChange={e => setDelAddress(e.target.value)} />
                <button className="operation-delegate-btn" onClick={() => onDelegate()}>Delegate</button>
                {globalState.isBeaconConnected && <button className="operation-beacon-btn" onClick={() => onBeaconDelegate()}>Delegate via Beacon</button>}
            </div>
            
        </div>
    );
}