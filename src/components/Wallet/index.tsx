import * as TezosRPCTypes from "conseiljs/dist/types/tezos/TezosRPCResponseTypes";
import {TezosNodeReader} from "conseiljs";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../context/GlobalState";
import {useSearchParams} from "react-router-dom";
import { Grid, Paper, Typography } from "@mui/material";

type WalletState = {
    publicKey: string,
    balance: string,
    delegate: string | undefined,
    balance_usdtz: string
}

const initialState: WalletState = {
    publicKey: "",
    balance: "",
    delegate: "",
    balance_usdtz: ""
}

export default function Wallet() {
    const {globalState } = useContext(GlobalContext);
    const [walletState, setWalletState] = useState(initialState);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        const fetchAccountInfo = async () => {
            const account: TezosRPCTypes.Contract = await TezosNodeReader.getAccountForBlock(
                globalState.tezosServer,
                "head",
                globalState.address);
            setWalletState( (w) => (
                {
                    ...w,
                    balance: account.balance,
                    delegate: account.delegate
                }
                )
            )
        }

        fetchAccountInfo().then(r => r);
    }, [globalState]);

    useEffect( () => {
        if(!searchParams.has("a"))
            setSearchParams({a: globalState.address});
        else if(searchParams.has("a") && searchParams.get("a") !== globalState.address)
        {
            setSearchParams({a: globalState.address});
        }
    }, [globalState, setSearchParams, searchParams])

    return (
        <Grid container spacing={2} alignItems='center' justifyContent="space-between" sx={{
            padding: '20px'
        }}>
            <Grid item xs={12} alignSelf='center'>
            <Paper elevation={5} sx={{
                backgroundColor: '#181A1F',
                width: '100%',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <Typography variant='h2' component='h2' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                }}>
                    Wallet
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                }}>
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",

                    marginBottom: '5vh',
                }}>
                Address: {globalState.address}
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                }}>
                Delegate: {walletState.delegate}
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                }}>
                XTZ Balance: {walletState.balance}
                </Typography>
            </Paper>
            </Grid>
        </Grid>            
    );
}
