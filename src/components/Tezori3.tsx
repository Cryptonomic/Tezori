import * as React from "react";
import { AddressBar } from "./AddressBar";
import { Settings } from "./Settings";
import { Wallet } from "./Wallet";
import { Gallery } from "./Gallery";
import { Navbar } from "./Navbar";
import Logger from "js-logger";
import { Navigate, Route, Routes } from 'react-router-dom';
import '../index.css'
import { Box, Grid } from "@mui/material";

export function Tezori3() {

    Logger.useDefaults();

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
            }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Navbar />
                </Grid>
                <AddressBar />
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/gallery" />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/gallery" replace />} />
                    </Routes>
                </main>
            </Grid>
        </Box>
    )
}
