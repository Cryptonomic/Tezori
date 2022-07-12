// Utility functions for working with Infura

/**
 * Converts a raw IPFS URL to the version proxied by Infura
 * @param url   Raw IPFS URL
 */
export function convertRawToProxiedIpfsUrl(url: string) {
    return url.startsWith("ipfs://") ?
        "https://tezori.infura-ipfs.io/ipfs/" + url.substring(7) :
        url;
}