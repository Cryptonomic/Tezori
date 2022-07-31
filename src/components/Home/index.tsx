import { Button, Grid, Modal, Typography } from '@mui/material'
import Illustration from '../../assets/images/Jumbotron.svg'

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

export default function Home(props: {setOpen: any, getFromLedger: any, getFromBeacon: any}) {
    return (
        <Grid container spacing={2} sx={{
            padding: '20px'
        }}>
            <Grid item xs={7} alignItems='center'>
                <Typography variant='h2' component='h2' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                    marginTop: '10vh'
                }}>
                    A reliable space for your crypto assets
                </Typography>
                <Button variant="contained" onClick={props.setOpen}
                sx={{
                    backgroundColor: '#5561FF',
                    color: '#ffffff',
                    borderRadius: '50px',
                    margin: '5px'
                }}>Connect Wallet</Button>
                <Button variant="contained" onClick={props.getFromLedger}
                sx={{
                    backgroundColor: '#FF5F55',
                    color: '#ffffff',
                    borderRadius: '50px',
                    margin: '5px'
                }}>Get from ledger</Button>
                <Button variant="contained" onClick={props.getFromBeacon}
                sx={{
                    backgroundColor: '#96FF55',
                    color: '#ffffff',
                    borderRadius: '50px',
                    margin: '5px'
                }}>Get from  Beacon</Button>
            </Grid>
            <Grid item xs={5}>
                <img src={Illustration} style={{
                    height: '85vh',
                    width: '35vw'
                }} />
            </Grid>
        </Grid>
    )
}
