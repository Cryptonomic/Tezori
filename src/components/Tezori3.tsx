import * as React from "react";
import Settings from "./Settings";
import Wallet from "./Wallet";
import Logger from "js-logger";
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import '../index.css'
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import Home from "./Home";
import Footer from "./Footer";
import AboutUs from "./AboutUs";
import Gallery from "./Gallery"
import ContactUs from "./ContactUs";
import Tezos from "@ledgerhq/hw-app-tezos";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { Action, ActionTypes } from "../context/AppReducer";
import { GlobalContext } from "../context/GlobalState";
import * as TezosDomainUtils from "../utils/TezosDomainsUtils";
import { Container } from "@mui/system";
import Navbar from './Navbar'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function Tezori3() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { globalState, dispatch } = React.useContext(GlobalContext);
    const [address, setAddress] = React.useState(globalState.address);
    const [ledgerInitialized, setLedgerInitalized] = React.useState(false);
    const [ledgerAppXtz, setLedgerAppXtz] = React.useState<Tezos>();
    const [searchParams] = useSearchParams();

    const handleAddressUpdateClick = async () => {
        const isTezosAddress = address.startsWith("tz") || address.startsWith("KT")
        const addressFromTezosDomains = !isTezosAddress ? await TezosDomainUtils.getAddressForTezosDomain(address, globalState.tezosServer, globalState.network) : null
        const updateAddress = !isTezosAddress && addressFromTezosDomains ? addressFromTezosDomains : address
        const action: Action = {
            type: ActionTypes.UpdateAddress,
            newTezosServer: globalState.tezosServer,
            newApiKey: globalState.apiKey,
            newNetwork: globalState.network,
            newDerivationPath: globalState.derivationPath,
            newAddress: updateAddress
        }
        dispatch(action);
    }

    const getAddressFromLedger = async () => {

        if (!ledgerInitialized) {
            const transport = await TransportWebHID.create()
            console.log("transport", transport)
            const appXtz = new Tezos(transport)
            console.log("appXtz", appXtz)
            setLedgerAppXtz(appXtz)
            setLedgerInitalized(true)
        }

        if (ledgerAppXtz) {
            const address = await ledgerAppXtz.getAddress(globalState.derivationPath)
            console.log("address", address)
            setAddress(address.address)
        }
    }

    const getAddressFromBeacon = async () => {
        const dAppClient = globalState.beaconClient
        if (dAppClient) {
            const activeAccount = await dAppClient.getActiveAccount();
            if (activeAccount) {
                setAddress(activeAccount.address)
            }
            else {
                console.log("Requesting permissions...");
                const permissions = await dAppClient.requestPermissions();
                console.log("Got permissions:", permissions);
                setAddress(permissions.address)
            }
        }
        else {
            throw ReferenceError("Beacon client not defined!")
        }
    }

    React.useEffect(() => {
        if (!globalState.isAddressInitialized) {
            if (searchParams.has("a")) {
                globalState.address = searchParams.get("a") as string
            }
            globalState.isAddressInitialized = true
        }
    }, [globalState, searchParams])

    React.useEffect(() => {
        setAddress(globalState.address)
    }, [globalState])

    Logger.useDefaults();

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
            }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Navbar setOpen={handleOpen} />
                </Grid>
                <Grid item xs={12}>
                    <Container fixed sx={{
                        minHeight: '50vh',
                        minWidth: '50vw'
                    }}>
                        <Routes>
                            <Route path="/" element={<Home setOpen={handleOpen} getFromLedger={getAddressFromLedger} getFromBeacon={getAddressFromBeacon} />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/wallet" element={<Wallet />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/gallery" replace />} />
                        </Routes>
                    </Container>
                </Grid>
                <Grid item xs={12}>
                    <hr style={{
                        color: '#ffffff',
                        width: '90vw',
                        marginBottom: '30px'
                    }} />
                    <Footer />
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Type in your wallet address!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        <TextField id="standard-basic" label="Standard" variant="standard"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                    </Typography>
                    <Button variant="contained" size='small'
                        onClick={() => handleAddressUpdateClick()}>
                        Update
                    </Button>
                </Box>
            </Modal>
        </Box>
    )
}
