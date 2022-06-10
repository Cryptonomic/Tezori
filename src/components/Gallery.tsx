import * as React from "react";
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalState";
import {ImageProxyServer} from "nft-image-proxy";
import * as ContentProxyUtils from "../utils/ContentProxyUtils";

export function Gallery() {
    const {globalState } = useContext(GlobalContext);

    const fetchImages = async () => {

        console.log("Fetching images..")

        const server: ImageProxyServer = {
            url: "https://imgproxy-prod.cryptonomic-infra.tech",
            version: "1.0.0",
            apikey: "TQf4O3OwUYaNYyXjVHLGXQoPZXa0FtsNSijyxxwSYhc7hbeJdtR2kLBK0uTBDsxJ",
        };

        const urls = [
            "https://upload.wikimedia.org/wikipedia/commons/8/84/Michelangelo%27s_David_2015.jpg",
            //"https://upload.wikimedia.org/wikipedia/commons/9/9d/Botticelli_-_Adoration_of_the_Magi_%28Zanobi_Altar%29_-_Uffizi.jpg",
            //"https://imageio.forbes.com/blogs-images/yjeanmundelsalle/files/2014/11/ymj_the-execution_a41-1940x966112.jpg?format=jpg&width=960"
        ]

        urls.forEach(url => ContentProxyUtils.fetchImage(server, url))
    }

    return (
        <div>
            <h1>Gallery</h1>
            <p>{globalState.address}</p>
            <button onClick={() => fetchImages()}>Load</button>
        </div>
    );
}