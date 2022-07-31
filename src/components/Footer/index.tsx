import { Grid, IconButton, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/Logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FooterImage from '../../assets/images/Footerimage.svg'
import ArticleIcon from '@mui/icons-material/Article';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Footer() {
    return (
        <Grid container item spacing={8} direction='row' justifyContent='center'>
            <Grid item xs={5}>
                <img className="inline" src={Logo} alt="logo" />
                <Typography variant='body1' sx={{
                    color: "#ffffff",
                    marginBottom: '5vh',
                    marginTop: '5vh'
                }}>
                    We are building a rich suite of tools to make developing and deploying blockchain applications easier. Our stack has helped us build multiple user tools and reliably host always-on global infrastructure.
                </Typography>
                <img className="inline" src={FooterImage} alt="logo" />
            </Grid>
            <Grid container item xs={6}>
                <Grid container item xs={12} direction='row' justifyContent='space-around'>
                    <Grid container direction='column' spacing={2} item xs={3} sx={{
                        width: '10vw'
                    }}>
                        <Grid item>
                            <Typography variant='body1' sx={{
                                color: "#ffffff",
                                marginBottom: '10px'
                            }}>Pages
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Link to="/about">
                                About us
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/contact">
                                Contact us
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container direction='column' spacing={2} item xs={3} sx={{
                        width: '10vw'
                    }}>
                        <Grid item>
                            <Typography variant='body1' sx={{
                                color: "#ffffff",
                                marginBottom: '10px'
                            }}>Services</Typography>
                        </Grid>
                        <Grid item>
                            <Link to="/contact">
                                Consulting
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/contact">
                                Blockchain Applications
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container item xs={3} direction='column' rowSpacing={1}>

                        <Grid item>
                            <Typography variant='body1' sx={{
                                color: "#ffffff",
                                marginBottom: '10px'
                            }}>Contact</Typography>
                        </Grid>
                        <Grid container alignItems='center' item>
                            <LocalPhoneIcon color="secondary" />
                            <Typography sx={{
                                color: "#ffffff",
                                fontSize: "10px"
                            }}>(406) 555-0120</Typography></Grid>
                        <Grid container alignItems='center' item>
                            <EmailIcon color="secondary" />
                            <Typography sx={{
                                color: "#ffffff",
                                fontSize: "10px"
                            }}>support@cryptonomic.tech</Typography>
                        </Grid>
                        <Grid container alignItems='center' item sx={{
                            width: '18vw'
                        }}>
                            <LocationOnIcon color="secondary" />
                            <Typography sx={{
                                color: "#ffffff",
                                fontSize: "10px",
                            }}> 100 Bogart Street, Brooklyn, NY 11206 USA</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xs={12} alignItems='center' justifyContent='flex-end' spacing={2}>
                    <Grid item><a href='https://github.com/Cryptonomic' target='_blank'><GitHubIcon color="secondary" /></a></Grid>
                    <Grid item><a href='https://twitter.com/CryptonomicTech' target='_blank'><TwitterIcon color="secondary" /></a></Grid>
                    <Grid item><a href='https://medium.com/the-cryptonomic-aperiodical' target='_blank'><ArticleIcon color="secondary" /></a></Grid>
                    <Grid item><a href='https://www.linkedin.com/company/cryptonomic' target='_blank'><LinkedInIcon color="secondary" /></a></Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
