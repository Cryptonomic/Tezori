import {FetchResponse, ImageProxyDataType, ImageProxyError, ImageProxyServer, proxyFetch} from "nft-image-proxy";
import Logger from "js-logger";

const LOCAL_STORAGE_KEY = "CONTENT_PROXY_CACHE"

type ContentProxyResult = FetchResponse | ImageProxyError

class CacheMissError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CacheMissError"
    }
}

const createCacheKey = (url: string) => {
    return LOCAL_STORAGE_KEY + "_" + url
}

export const fetchImage = async (server: ImageProxyServer, url: string) => {
    try {
        return fetchFromLocalStorage(url)
    }
    catch(e: any) {
        if(! (e instanceof CacheMissError))
            Logger.warn(e)
        const result = await proxyFetch(
            server,
            url,
            ImageProxyDataType.Json,
            false
        )

        Logger.info("Content proxy result: " + result)
        saveToLocalStorage(url, result)
        return result
    }
}

const saveToLocalStorage = (url: string, result: ContentProxyResult) => {
    const key = createCacheKey(url)
    localStorage.setItem(key, JSON.stringify(result))
    Logger.info("Cache save: " + key)
}

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