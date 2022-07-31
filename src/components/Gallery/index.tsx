import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import * as ContentProxyUtils from "../../utils/ContentProxyUtils";
import * as InfuraUtils from "../../utils/InfuraUtils";
import * as TezTokUtils from "../../utils/TezTokUtils";
import Logger from "js-logger";
import { CacheMissError, ModerationInfo } from "../../utils/ContentProxyUtils";
import { TezTokHolding } from "../../types/TezTokResult";
import * as TezosDomainUtils from "../../utils/TezosDomainsUtils";
import { useSearchParams } from "react-router-dom";
import { CardMedia, CardContent, Typography, Card, Grid, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const NftImageCard = (props: { src: string, title: string }) => {
    return (
        <Grid item>
            <Card sx={{
                height: 300,
                width: 300
            }}>
                <CardMedia
                    component="img"
                    height="140"
                    src={props.src}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{
                        fontSize: '18px'
                    }}>
                        {props.title.slice(0, 100)}...
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
const NftVideoCard = (props: { src: string, title: string }) => {
    return (
        <Grid item>
            <Card sx={{
                height: 300,
                width: 300
            }}>
                <CardMedia
                    component="img"
                    height="140"
                    src={props.src}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{
                        fontSize: '18px'
                    }}>
                        {props.title.slice(0, 100)}...
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default function Gallery() {
    const { globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>([]);
    const [vidURLS, setVidURLS] = useState<string[]>([])
    const [moderationResults, setModerationResults] = useState<Map<string, ModerationInfo | CacheMissError>>(new Map<string, ModerationInfo | CacheMissError>())
    const [nftInfo, setNFTInfo] = useState<Map<string, TezTokHolding>>(new Map<string, TezTokHolding>())
    const [isModerationOn, setModerationOn] = useState<boolean>(true)
    const [displayAddress, setDisplayAddress] = useState<string>(globalState.address)
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Updates state to reflect the moderated NFT holdings of a given address.
     * @param holder    The given address
     */
    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content for " + holder)

        Logger.info("Clearing old data..")
        setURLS([])
        setVidURLS([])
        setModerationResults(new Map<string, ModerationInfo | CacheMissError>())
        setNFTInfo(new Map<string, TezTokHolding>())

        Logger.info("Getting NFT data from TezTok")
        const tezTokResult = await TezTokUtils.queryTezTok(holder)
        const allURLS = TezTokUtils.extractURLsFromTezTokHoldings(tezTokResult)
        const imageURLs = TezTokUtils.extractImageURLsFromTezTokHolding(tezTokResult)
        const videoURLs = TezTokUtils.extractVideoURLsFromTezTokHolding(tezTokResult)
        Logger.info("TezTok URLs: " + JSON.stringify(allURLS))
        Logger.info("TezTok image URLs: " + JSON.stringify(imageURLs))
        Logger.info("TezTok video URLs: " + JSON.stringify(videoURLs))

        Logger.info("Fetching moderation results from content proxy")
        const moderationMap = ContentProxyUtils.moderateURLs(imageURLs)

        Logger.info("Rendering images..")
        function moderationCallbackFn(url: string, moderationInfo: ModerationInfo) {
            setURLS(u => u.concat(url))
            setModerationResults(m => m.set(url, moderationInfo))
        }
        ContentProxyUtils.processModerationData(moderationMap, moderationCallbackFn)

        setNFTInfo(tezTokResult)
        setVidURLS(videoURLs)

        await Promise.all(moderationMap.values())
        Logger.info("Done fetching NFT content.")
    }

    useEffect(() => {
        fetchImages(globalState.address).then(r => r)
    }, [globalState])

    /**
     * Applies moderation and proxying logic to figure out the actual rendered URL for a given NFT content URL
     * @param url
     */
    const processURLForDisplay = (url: string) => {
        if (!moderationResults.has(url)) return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        const moderationInfo = moderationResults.get(url)
        if (typeof moderationInfo !== "undefined" && !("moderation_status" in moderationInfo))
            return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        else {
            const mi = moderationInfo as ModerationInfo
            if (mi.categories.length > 0 && isModerationOn) {
                return "https://upload.wikimedia.org/wikipedia/commons/3/39/Hazard_T.svg"
            }
            else
                return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        }
    }

    const getMouseOverText = (url: string) => {
        const thisNFT = nftInfo.get(url)?.token
        if (thisNFT === undefined) return "N/A"
        const name = thisNFT.name !== undefined ? thisNFT.name : "Unknown"
        const artist = thisNFT.artist_profile?.alias !== undefined ? thisNFT.artist_profile.alias : "Unknown"
        const description = thisNFT.description !== undefined ? thisNFT.description : "No Description"
        return name + " by " + artist + "\n\n\n" + description
    }

    /**
     * Toggles content moderation on and off
     */
    function toggleContentModeration() {
        setModerationOn(!isModerationOn)
    }

    useEffect(() => {
        setDisplayAddress(globalState.address)
        TezosDomainUtils.getTezosDomainForAddress(
            globalState.address,
            globalState.tezosServer,
            globalState.network).then(tezDomain => {
                if (tezDomain) setDisplayAddress(tezDomain)
            })
    }, [globalState])

    useEffect(() => {
        if (!searchParams.has("a"))
            setSearchParams({ a: globalState.address });
        else if (searchParams.has("a") && searchParams.get("a") !== globalState.address) {
            setSearchParams({ a: globalState.address });
        }
    }, [globalState, setSearchParams, searchParams])

    return (
        <Grid container item direction='column'>
            <Grid container item alignItems='center' justifyContent='space-around'>
                <Typography variant='h2' component='h2' sx={{
                    color: "#FFFFFF",
                    margin: '5vh',
                }}>
                    Gallery for {displayAddress}
                </Typography>
                <FormGroup>
                    <FormControlLabel id={"moderation-toggle"} control={<Checkbox defaultChecked={isModerationOn} onChange={toggleContentModeration} color='secondary'/>} label="Content moderation?" sx={{
                        color: '#FFFFFF'
                    }}/>
                </FormGroup>
            </Grid>
            <Grid container item direction='row' spacing={2} justifyContent='center'>
                {
                    urls.concat(vidURLS).sort().map(url =>
                        urls.includes(url) ?
                            <NftImageCard src={processURLForDisplay(url)} key={url} title={getMouseOverText(url)} /> :
                            <NftVideoCard src={processURLForDisplay(url) + "#t=0.1"} key={url} title={getMouseOverText(url)} />
                    )
                }
            </Grid>
        </Grid>
    );
}
