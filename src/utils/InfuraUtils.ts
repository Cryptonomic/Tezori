export function convertRawToProxiedIpfsUrl(url: string) {
    return url.startsWith("ipfs://") ?
        "https://tezori.infura-ipfs.io/ipfs/" + url.substring(7) :
        url;
}