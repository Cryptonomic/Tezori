import { Grid, Typography } from '@mui/material'
import { Container } from '@mui/system'
import Logo from '../../assets/images/Logo.png'

export default function Footer() {
    return (
        <Grid container item>
            <Container>
            <Grid item xs={6}>
                <img className="inline" src={Logo} alt="logo" />
                <Typography variant='body1' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                    marginTop: '10vh'
                }}>
                We are building a rich suite of tools to make developing and deploying blockchain applications easier. Our stack has helped us build multiple user tools and reliably host always-on global infrastructure.
                </Typography>
            </Grid>
            <Grid item xs={6}></Grid>
            </Container>
        </Grid>
    )
}
