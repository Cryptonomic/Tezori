import {FetchResponse, ImageProxyDataType, ImageProxyError, ImageProxyServer, proxyFetch} from "nft-image-proxy";
import Logger from "js-logger";

/**
 * Prefix used for storing content proxy data in local storage
 */
const LOCAL_STORAGE_KEY = "CONTENT_PROXY_CACHE"

type ContentProxyResult = FetchResponse | ImageProxyError

/**
 * Bespoke error for cache misses in local storage for content proxy data.
 */
class CacheMissError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CacheMissError"
    }
}

/**
 * Given a URL, creates a corresponding key to be used in local storage.
 * @param url   The URL for which content proxy data is being stored.
 */
const createCacheKey = (url: string) => {
    return LOCAL_STORAGE_KEY + "_" + url
}

/**
 * Given a URL, fetch content proxy data preferentially from local storage,
 * otherwise from a given content proxy server.
 * NOTE: The caching implementation is quite naive and can be improved in the future as the need arises.
 * @param server    The server to fall back on if the data is not available in local storage.
 * @param url       The URL for which content proxy data is being fetched.
 */
export const lookupContentProxy = async (server: ImageProxyServer, url: string) => {
    try {
        return fetchFromLocalStorage(url)
    }
    catch(e: any) {
        if(! (e instanceof CacheMissError))
            Logger.warn(e)
        // TODO: Switch to img_proxy_describe
        const result = await proxyFetch(
            server,
            url,
            ImageProxyDataType.Json,
            false
        )

        Logger.info("Content proxy result: " + result)
        // TODO: Differential handling of bona-fide and error results.
        //saveToLocalStorage(url, result)
        return result
    }
}

/**
 * Saves content proxy results to local storage.
 * @param url       The URL to which the results correspond.
 * @param result    The results to be stored.
 */
const saveToLocalStorage = (url: string, result: ContentProxyResult) => {
    const key = createCacheKey(url)
    localStorage.setItem(key, JSON.stringify(result))
    Logger.info("Cache save: " + key)
}

/**
 * Fetches content proxy results from local storage.
 * @param url       The URL for which the results are desired.
 */
const fetchFromLocalStorage = (url: string) => {
    const key = createCacheKey(url)
    const cachedResult = localStorage.getItem(key)
    if(cachedResult == null) {
        Logger.info("Cache miss: " + key)
        throw new CacheMissError("Item not found in local storage: " + url)
    }
    const result: ContentProxyResult = JSON.parse(cachedResult)
    Logger.info("Cache hit: " + key)
    return result
}
