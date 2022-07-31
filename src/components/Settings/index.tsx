import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { Action, ActionTypes } from "../../context/AppReducer";
import { GlobalContext } from "../../context/GlobalState";
import { useSearchParams } from "react-router-dom";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";

export default function Settings() {
    const { globalState, dispatch } = useContext(GlobalContext);
    const [tezosServer, setTezosServer] = useState(globalState.tezosServer);
    const [apiKey, setApiKey] = useState(globalState.apiKey);
    const [network, setNetwork] = useState(globalState.network);
    const [derivationPath, setDerivationPath] = useState(globalState.network);
    const [address] = useState(globalState.address);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSettingsUpdateClick = () => {
        const action: Action = {
            type: ActionTypes.UpdateSettings,
            newTezosServer: tezosServer,
            newApiKey: apiKey,
            newNetwork: network,
            newAddress: address,
            newDerivationPath: derivationPath
        }
        dispatch(action);
    }

    useEffect(() => {
        if (!searchParams.has("a"))
            setSearchParams({ a: globalState.address });
        else if (searchParams.has("a") && searchParams.get("a") !== globalState.address) {
            setSearchParams({ a: globalState.address });
        }
    }, [globalState, setSearchParams, searchParams])

    return (
        <Grid container spacing={2} alignItems='center' justifyContent="center" sx={{
            padding: '20px'
        }}>
            <Grid item xs={12}>
                <Paper elevation={5} sx={{
                    backgroundColor: '#181A1F',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '20px'
                }}>
                    <Typography variant='h2' component='h2' sx={{
                        color: "#ffffff",
                        marginBottom: '5vh',
                    }}>
                        Settings
                    </Typography>
                    <Typography variant='body1' component='body' sx={{
                        color: "#ffffff",
                        marginBottom: '5vh',
                    }}>
                        <TextField focused sx={{
                            backgroundColor: '#ffffff'
                        }} color="primary" id="settings_tezosNode" label="Tezos Node" variant="filled"
                            defaultValue={globalState.tezosServer}
                            onChange={e => setTezosServer(e.currentTarget.value)}
                        />
                    </Typography>
                    <Typography variant='body1' component='body' sx={{
                        color: "#ffffff",
                        marginBottom: '5vh',
                    }}>
                        <TextField focused sx={{
                            backgroundColor: '#ffffff'
                        }} color="primary" id="settings_apikey" label="Nautilus API Key" variant="filled"
                            defaultValue={globalState.apiKey}
                            onChange={e => setTezosServer(e.currentTarget.value)}
                        />
                    </Typography>
                    <Typography variant='body1' component='body' sx={{
                        color: "#ffffff",
                        marginBottom: '5vh',
                    }}>
                        <TextField focused sx={{
                            backgroundColor: '#ffffff'
                        }} color="primary" id="settings_network" label="Network" variant="filled"
                            defaultValue={globalState.network}
                            onChange={e => setTezosServer(e.currentTarget.value)}
                        />
                    </Typography>
                    <Typography variant='body1' component='body' sx={{
                        color: "#ffffff",
                        marginBottom: '5vh',
                    }}>
                        <TextField focused sx={{
                            backgroundColor: '#ffffff'
                        }} color="primary" id="settings_derivationPath" label="Derivation Path" variant="filled"
                            defaultValue={globalState.derivationPath}
                            onChange={e => setTezosServer(e.currentTarget.value)}
                        />
                    </Typography>   
                        <Button variant="contained" size='small' sx={{
                            backgroundColor: '#5561FF'
                        }}
                            onClick={() => handleSettingsUpdateClick()}>
                            Update
                        </Button>
                </Paper>
            </Grid>
        </Grid>
    );
}