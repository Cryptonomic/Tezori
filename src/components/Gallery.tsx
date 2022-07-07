import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";
import * as TezTokUtils from "../utils/TezTokUtils";
import Logger from "js-logger";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>();

    const fetchImages = async (holder: string) => {
        Logger.info("Fetching NFT content")

        Logger.info("Getting NFTs for current address from TezTok")
        const tezTokResult = await TezTokUtils.queryTezTok(holder)
        Logger.info("TezTok URLs: " + tezTokResult.contentURLs)

        Logger.info("Fetching moderation results from content proxy and rendering results")
        const urls = Array.from(tezTokResult.contentURLs)
        const moderationMap = await ContentProxyUtils.getSuccessfullyModeratedURLS(await ContentProxyUtils.moderateURLs(urls))
        setURLS(Array.from(moderationMap.keys()))
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
