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
export class CacheMissError extends Error {
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
    Logger.info("Lookup result: " + JSON.stringify(storedResult))
    if(storedResult instanceof CacheMissError) {
        Logger.info("Fetching from content proxy: " + url)
        // TODO: Switch to img_proxy_describe
        return proxyFetch(
            contentProxyServer,
            url,
            ImageProxyDataType.Json,
            false
        ).then(result => {
            if (typeof result !== "string" && result.rpc_status.toString() === "Ok") {
                saveToLocalStorage(url, result as FetchResponse)
                return fetchFromLocalStorage(url);
            }
            else {
                Logger.warn("Content proxy could not return a result for: " + url + ". The result was: " + JSON.stringify(result))
                Logger.info(typeof result)
                if (typeof result !== "string") Logger.info(result.rpc_status.toString() === "Ok")
                return new CacheMissError(JSON.stringify(result))
            }
        })
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
        Logger.info("Cache save: " + key + JSON.stringify(justTheModerationResults))
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

/**
 * Applies content moderation to a batch of URLs and returns the results by URL.
 * @param urls  The URLs to moderate
 */
export const moderateURLs = (urls: string[]) => {
    const moderationData = urls.map(url => lookupContentProxy(url))
    const zippedModerationData = moderationData.map((r, i) => {
        return {url: urls[i], result: r}
    })
    return new Map(zippedModerationData.map(x => [x.url, x.result]))
}

function processSingleModerationItem(result: [string, Promise<ModerationInfo | CacheMissError>], callbackFn: (url: string, moderationInfo: ModerationInfo) => any) {
    const url = result[0]
    const resultPromise = result[1]
    return resultPromise.then((finalResult) => {
        if("moderation_status" in finalResult) {
            callbackFn(url, finalResult)
        }
    })
}

/**
 * Applies a given callback function for all URLs for which the content proxy returned successful moderation results.
 * @param moderationMap Moderation results for a batch of URLs
 * @param callbackFn    Callback function to apply for all entries which have successful moderation results
 */
export function processModerationData(moderationMap: Map<string, Promise<ModerationInfo | CacheMissError>>, callbackFn: (url: string, moderationInfo: ModerationInfo) => any) {
    Array.from(moderationMap).map(x => processSingleModerationItem(x, callbackFn))
}