import { Grid, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Illustration from '../../assets/images/Contactus.svg'

function ContactUs() {
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
                    Contact us
                </Typography>
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                }}>
                    For all inquiries, please contact us at <a href="mailto:support@cryptonomic.tech">support@cryptonomic.tech</a>.
                </Typography>
                <br />
                <Typography variant='body1' component='body' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                    alignItems: 'center',
                    display: 'flex'
                }}>
                    We are located at:

                    <LocationOnIcon color="secondary" sx={{

                    }} /> 100 Bogart Street, Brooklyn, NY 11206 USA</Typography>
            </Grid>
            <Grid item xs={5}>
                <img src={Illustration} alt='illustration' style={{
                    height: '85vh',
                    width: '35vw'
                }} />
            </Grid>
        </Grid>
    )
}

export default ContactUs