import * as React from "react";
import {useContext, useState} from "react";
import {GlobalContext} from "../context/GlobalState";
import {ImageProxyServer} from "nft-image-proxy";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";
import TezTokResult from "../types/TezTokResult"

export function Gallery() {
    const {globalState } = useContext(GlobalContext);
    const [urls, setURLS] = useState<string[]>();

    const fetchImages = async () => {

        console.log("Fetching images..")

        const tezTokServer = "https://api.teztok.com/v1/graphql"

        const tezTokQuery = {query: `
        query LatestEvents {
          holdings(limit: 100, where: {holder_address: {_eq: "tz1NEGFHXe2XEztwCfpduZqULRFTUZQTezSt"}}) {
            holder_address
            token {
              artist_profile {
                account
                alias
              }
              artifact_uri
              description
              name
              platform
            }
          }
        }
        `}

        const response = await fetch(
            tezTokServer,
            {
                method: 'post',
                body: JSON.stringify(tezTokQuery),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(tezTokQuery).length.toString(),
                },
                credentials: 'include',
            }
        );
        const responseJson = await response.json()
        const tezTokResult = responseJson as TezTokResult
        const tezTokURLS = tezTokResult.data.holdings.map(item => item.token.artifact_uri)
        console.log("TezTok URLs: " + tezTokURLS)

        const contentProxyServer: ImageProxyServer = {
            url: "https://imgproxy-prod.cryptonomic-infra.tech",
            version: "1.0.0",
            apikey: "TQf4O3OwUYaNYyXjVHLGXQoPZXa0FtsNSijyxxwSYhc7hbeJdtR2kLBK0uTBDsxJ",
        };

        /*const urls = [
            "https://upload.wikimedia.org/wikipedia/commons/8/84/Michelangelo%27s_David_2015.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9d/Botticelli_-_Adoration_of_the_Magi_%28Zanobi_Altar%29_-_Uffizi.jpg",
            "https://imageio.forbes.com/blogs-images/yjeanmundelsalle/files/2014/11/ymj_the-execution_a41-1940x966112.jpg?format=jpg&width=960"
        ].concat(tezTokURLS)*/

        const urls = tezTokURLS

        /*const processedURLS = urls.map(url => {
            if(url.startsWith("ipfs://")) return "https://tezori.infura-ipfs.io/ipfs/" + url.substring(7)
            else return url
        })
        console.log("Processed URL: " + JSON.stringify(processedURLS))*/

        //const moderationResults = processedURLS.map(url => ContentProxyUtils.lookupContentProxy(contentProxyServer, url))
        let moderatedURLS: string[] = []
        for(let url of urls) {
            console.log(url)
            const moderationInfo = await ContentProxyUtils.lookupContentProxy(contentProxyServer, url)
            console.log(JSON.stringify(moderationInfo))
            if("moderation_status" in moderationInfo) {
                moderatedURLS.push(
                    url.startsWith("ipfs://")?
                        "https://tezori.infura-ipfs.io/ipfs/" + url.substring(7) :
                        url
                )
            }
        }
        console.log("Processed URLs: " + JSON.stringify(moderatedURLS))
        setURLS(moderatedURLS)
    }

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
            <button onClick={() => fetchImages()}>Load</button>
        </div>
    );
}
