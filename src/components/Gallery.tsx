import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";
import * as InfuraUtils from "../utils/InfuraUtils";
import * as TezTokUtils from "../utils/TezTokUtils";
import Logger from "js-logger";
import {CacheMissError, ModerationInfo} from "../utils/ContentProxyUtils";
import {TezTokHolding} from "../types/TezTokResult";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>([]);
    const [vidURLS, setVidURLS] = useState<string[]>([])
    const [moderationResults, setModerationResults] = useState<Map<string, ModerationInfo | CacheMissError>>(new Map<string, ModerationInfo | CacheMissError>())
    const [, setNFTInfo] = useState<Map<string, TezTokHolding>>(new Map<string, TezTokHolding>())

    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content for " + holder)

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
        let imageURLsToDisplay: string[] = []
        const finalModerationResults = new Map<string, ModerationInfo | CacheMissError>()
        function processModerationResult(result: Promise<ModerationInfo | CacheMissError>, url: string) {
            result.then((finalResult) => {
                if("moderation_status" in finalResult) {
                    imageURLsToDisplay.push(url)
                    finalModerationResults.set(url, finalResult)
                }
            })
        }
        moderationMap.forEach(processModerationResult)

        setNFTInfo(tezTokResult)
        setURLS(imageURLsToDisplay)
        setVidURLS(videoURLs)
        setModerationResults(finalModerationResults)
    }

    useEffect( () => {
        fetchImages(globalState.address).then(r => r)
    }, [globalState])

    const moderateImage = (url: string) => {
        if(!moderationResults.has(url)) return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        const moderationInfo = moderationResults.get(url)
        // @ts-ignore
        if(! ("moderation_status" in moderationInfo)) return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        else {
            const mi = moderationInfo as ModerationInfo
            if(mi.categories.length > 0) {
                return "https://upload.wikimedia.org/wikipedia/commons/3/39/Hazard_T.svg"
            }
            else
                return InfuraUtils.convertRawToProxiedIpfsUrl(url)
        }
    }

    return (
        <div>
            <h1>Gallery for {globalState.address}</h1>
                {
                    urls.concat(vidURLS).sort().map(url =>
                            urls.includes(url) ?
                            <img src={moderateImage(url)} alt={""} className={"gallery-image"} key={url} /> :
                            <video src={moderateImage(url)} className={"gallery-image"} key={url} muted loop controls />
                    )
                }
        </div>
    );
}
