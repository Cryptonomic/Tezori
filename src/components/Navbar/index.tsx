import { Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from "../../assets/images/Logo.png"

const Text = (props: { text: string }) => {
    return (
        <Typography sx={{
            color: '#ffffff',
            textDecoration: 'none'
        }}>
            {props.text}
        </Typography>
    )
}

export default function Navbar(props: {setOpen: any}) {
    return (
        <nav className="nav">
            <Grid container spacing={12} sx={{
                paddingTop: '20px',
                paddingLeft: '20px'
            }}>
                <Grid container item xs={9} spacing={2} alignItems="center">
                    <Grid item xs={2.8}>
                    <Link to="/">
                        <img src={Logo} alt="logo" />
                    </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Link to="/about">
                            <Text text='About us' />
                        </Link>
                    </Grid>
                    <Grid item xs={1.2}>
                        <Link to="/contact">
                            <Text text='Contact us' />
                        </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Link to="/gallery">
                            <Text text='Gallery' />
                        </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Link to="/wallet">
                            <Text text='Wallet' />
                        </Link>
                    </Grid>
                    <Grid item xs={1}>
                        <Link to="/settings">
                            <Text text='Settings' />
                        </Link>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                        <Button variant="contained" size='small' onClick={props.setOpen} sx={{
                            marginTop: '10px',
                            marginRight: '5px',
                            backgroundColor: '#5561FF',
                            color: '#ffffff',
                            borderRadius: '50px'
                        }}>Connect Wallet</Button>
                </Grid>
            </Grid>
        </nav>
    )
}