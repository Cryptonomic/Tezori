import {FetchResponse, ImageProxyDataType, ImageProxyServer, proxyFetch} from "nft-image-proxy";
import Logger from "js-logger";
import {ModerationLabel, ModerationStatus} from "nft-image-proxy/dist/types/common";

export interface ModerationInfo {
    moderation_status: ModerationStatus;
    categories: ModerationLabel[];
}

/**
 * Prefix used for storing content proxy data in local storage
 */
const LOCAL_STORAGE_KEY = "CONTENT_PROXY_CACHE"

const contentProxyServer: ImageProxyServer = {
    url: "https://imgproxy-prod.cryptonomic-infra.tech",
    version: "1.0.0",
    apikey: "TQf4O3OwUYaNYyXjVHLGXQoPZXa0FtsNSijyxxwSYhc7hbeJdtR2kLBK0uTBDsxJ",
};

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
 * @param url       The URL for which content proxy data is being fetched.
 */
export const lookupContentProxy = async (url: string) => {
    const storedResult = fetchFromLocalStorage(url);
    Logger.info("Stored result: " + JSON.stringify(storedResult))
    if(storedResult instanceof CacheMissError) {
        Logger.info("Fetching from content proxy")
        // TODO: Switch to img_proxy_describe
        const result = await proxyFetch(
            contentProxyServer,
            url,
            ImageProxyDataType.Json,
            false
        )
        if (typeof result !== "string" && result.rpc_status.toString() === "Ok") {
            Logger.info("foo")
            saveToLocalStorage(url, result as FetchResponse)
            return fetchFromLocalStorage(url);
        }
        else {
            Logger.info("bar")
            Logger.warn("Content proxy could not return a result for: " + url + ". The result was: " + JSON.stringify(result))
            Logger.info(typeof result)
            if (typeof result !== "string") Logger.info(result.rpc_status.toString() === "Ok")
            return new CacheMissError(JSON.stringify(result))
        }
    }
    return storedResult
}

/**
 * Saves content proxy results to local storage.
 * @param url       The URL to which the results correspond.
 * @param contentProxyResponse    The results to be stored.
 */
const saveToLocalStorage = (url: string, contentProxyResponse: FetchResponse): boolean => {
    if (typeof contentProxyResponse !== "string" && contentProxyResponse.rpc_status.toString() === "Ok") {
        const key = createCacheKey(url)
        const justTheModerationResults: ModerationInfo = {
            moderation_status: contentProxyResponse.result.moderation_status,
            categories: contentProxyResponse.result.categories
        }
        localStorage.setItem(key, JSON.stringify(justTheModerationResults))
        Logger.info("Cache save: " + key)
        return true
    }
    return false
}

/**
 * Fetches content proxy results from local storage.
 * @param url       The URL for which the results are desired.
 */
const fetchFromLocalStorage = (url: string): ModerationInfo | CacheMissError => {
    const key = createCacheKey(url)
    const cachedResult = localStorage.getItem(key)
    if(cachedResult == null) {
        Logger.info("Cache miss: " + key)
        return new CacheMissError("Item not found in local storage: " + url)
    }
    const result: ModerationInfo = JSON.parse(cachedResult)
    Logger.info("Cache hit: " + key)
    return result
}

export const moderateURLs = async (urls: string[]) => {
    const moderationData = await Promise.all(urls.map(url => lookupContentProxy(url)))
    const zippedModerationData = moderationData.map((r, i) => {
        return {url: urls[i], result: r}
    })
    return new Map(zippedModerationData.map(x => [x.url, x.result]))
}

export const getSuccessfullyModeratedURLS = async (moderationMap:  Map<string, ModerationInfo | CacheMissError>) => {
    const resultsWithValidRecords = Array.from(moderationMap.entries()).filter(x => ("moderation_status" in x[1]))
    return new Map(resultsWithValidRecords)
}

