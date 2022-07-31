import { Grid, Typography } from '@mui/material'
import Illustration from '../../assets/images/AboutusIllustration.svg'

function AboutUs() {
    return (
        <Grid container spacing={2} justifyContent="space-between" sx={{
            padding: '20px'
        }}>
            <Grid item xs={6} alignItems='center'>
                <Typography variant='h2' component='h2' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                    marginTop: '10vh'
                }}>
                    About Us
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                }}>
                    Cryptonomic is an NYC-based company committed to decentralization and digital sovereignty. We provide tools and smart contracts which enable higher level decentralized and consortium applications. By embracing all aspects of decentralized technology we are helping build the economy of the future.
                </Typography>
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

export default AboutUs