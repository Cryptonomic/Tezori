import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";
import {ModerationInfo} from "../utils/ContentProxyUtils";
import * as TezTokUtils from "../utils/TezTokUtils";
import * as InfuraUtils from "../utils/InfuraUtils"
import Logger from "js-logger";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>();

    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content")

        Logger.info("Getting NFTs for current address from TezTok")
        const tezTokResult = await TezTokUtils.queryTezTok(holder)
        const tezTokURLS = tezTokResult.data.holdings.map(item => item.token.artifact_uri)
        Logger.info("TezTok URLs: " + tezTokURLS)

        const urls = tezTokURLS

        Logger.info("Fetching moderation results from content proxy and rendering results")
        let contentProxyPromises: Promise<void>[] = []
        let moderatedURLS: string[] = []
        let moderationResults: Map<string, ModerationInfo> = new Map<string, ModerationInfo>()
        for(let url of urls) {
            console.log(url)
            const contentProxyPromise = ContentProxyUtils.lookupContentProxy(url).then ( (moderationInfo) => {
                console.log(JSON.stringify(moderationInfo))
                if ("moderation_status" in moderationInfo) {
                    moderatedURLS.push(InfuraUtils.convertRawToProxiedIpfsUrl(url))
                    moderationResults.set(url, moderationInfo)
                }
            }
            ).then ( () => setURLS(moderatedURLS) )
            contentProxyPromises.push(contentProxyPromise)
        }
        await Promise.all(contentProxyPromises)
        Logger.info("Processed URLs: " + JSON.stringify(moderatedURLS))
        setURLS(moderatedURLS)
        const leftoverURLS = urls.filter(u => !moderatedURLS.includes(u))
        Logger.info("Leftover URLs: " + JSON.stringify(leftoverURLS))
    }

    useEffect( () => {
        fetchImages(globalState.address).then(r => r)
    }, [globalState])

    return (
        <div>
            <h1>Gallery for {globalState.address}</h1>
            <div id={"gallery"}>
                {
                    urls?.map(url =>
                         <img src={url} alt={""} className={"gallery-image"} key={url} />
                    )
                }
            </div>
        </div>
    );
}
