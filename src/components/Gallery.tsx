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

    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content")

        Logger.info("Getting NFTs for current address from TezTok")
        const tezTokResult = await TezTokUtils.queryTezTok(holder)
        const imgURLS = Array.from(tezTokResult.contentURLs).filter(url => url !== null)
        Logger.info("TezTok URLs: " + JSON.stringify(imgURLS))

        Logger.info("Fetching moderation results from content proxy")
        const moderationMap = ContentProxyUtils.moderateURLs(imgURLS)

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
            </div>
        </div>
    );
}
