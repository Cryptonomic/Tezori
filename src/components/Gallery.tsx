import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";
import * as InfuraUtils from "../utils/InfuraUtils";
import * as TezTokUtils from "../utils/TezTokUtils";
import Logger from "js-logger";
import {CacheMissError, ModerationInfo} from "../utils/ContentProxyUtils";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>([]);
    const [vidURLS, setVidURLS] = useState<string[]>([])

    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content")

        Logger.info("Getting NFTs for current address from TezTok")
        const tezTokResult = await TezTokUtils.queryTezTok(holder)
        const allURLS = Array.from(tezTokResult.keys()).filter(url => url !== null)

        function isImage(url: string) {
            // @ts-ignore
            const holding = tezTokResult.get(url)
            Logger.info("poo: " + JSON.stringify(holding))
            // @ts-ignore
            if(holding.token.mime_type === null) return false
            // @ts-ignore
            if(holding.token.mime_type.includes("xml")) return false
            // @ts-ignore
            return holding.token.mime_type.includes("image");
        }

        function isVideo(url: string) {
            // @ts-ignore
            const holding = tezTokResult.get(url)
            Logger.info("moo: " + JSON.stringify(holding))
            // @ts-ignore
            if(holding.token.mime_type === null) return false
            // @ts-ignore
            return holding.token.mime_type.includes("video");
        }

        const imageURLs = allURLS.filter(isImage)
        // @ts-ignore
        const videoURLs = allURLS.filter(isVideo).map(InfuraUtils.convertRawToProxiedIpfsUrl)
        Logger.info("Video URLS: " + JSON.stringify(videoURLs))
        Logger.info("TezTok URLs: " + JSON.stringify(allURLS))

        Logger.info("Fetching moderation results from content proxy")
        const moderationMap = ContentProxyUtils.moderateURLs(imageURLs)

        Logger.info("Rendering images..")
        const displayURLs: string[] = []
        function processModerationResult(result: Promise<ModerationInfo | CacheMissError>, url: string) {
            result.then((result) => {
                if("moderation_status" in result) {
                    const gatewayedURL = InfuraUtils.convertRawToProxiedIpfsUrl(url)
                    displayURLs.push(gatewayedURL)
                }
            })
        }
        moderationMap.forEach(processModerationResult)
        setURLS(displayURLs)
        setVidURLS(videoURLs)
    }

    useEffect( () => {
        fetchImages(globalState.address).then(r => r)
    }, [globalState])

    return (
        <div>
            <h1>Gallery for {globalState.address}</h1>
            <div id={"gallery"}>
                {
                    urls.map(url =>
                         <img src={url} alt={""} className={"gallery-image"} key={url} />
                    )
                }
                {
                    vidURLS.map(url =>
                        <video src={url} className={"gallery-image"} key={url} controls autoPlay muted loop />
                    )
                }
            </div>
        </div>
    );
}
