import TezTokResult, {TezTokHolding} from "../types/TezTokResult";

const getTezTokServerURL = () => {return "https://api.teztok.com/v1/graphql";}

const getTezTokQuery = (holder: string) => {
    return {
        query: `
        query LatestEvents {
          holdings(limit: 100, where: {holder_address: {_eq: "${holder}"}}) {
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
              mime_type
            }
          }
        }
        `
        }
    }

export const queryTezTok = async (holder: string): Promise<Map<string, TezTokHolding>> => {
    const response = await fetch(
        getTezTokServerURL(),
        {
            method: 'post',
            body: JSON.stringify(getTezTokQuery(holder)),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(getTezTokQuery(holder)).length.toString(),
            },
            credentials: 'include',
        }
    );
    const responseJson = await response.json()
    const tezTokResult = responseJson as TezTokResult
    const contentURLs = extractContentURLSFromTezTokResults(tezTokResult)
    const zippedTezTokData = tezTokResult.data.holdings.map((r, i) => {
        return {url: contentURLs[i], holding: r}
    })
    return new Map(zippedTezTokData.map(x => [x.url, x.holding]))
}

const extractContentURLSFromTezTokResults = (tezTokResult: TezTokResult): string[] => {
    return tezTokResult.data.holdings.map(item => item.token.artifact_uri)
}

function isImageURL(tezTokHoldings: Map<string, TezTokHolding>, url: string) {
    const holding = tezTokHoldings.get(url)
    if(holding?.token.mime_type === null) return false
    if(holding?.token.mime_type.includes("xml")) return false
    return holding?.token.mime_type.includes("image");
}

function isVideoURL(tezTokHoldings: Map<string, TezTokHolding>, url: string) {
    const holding = tezTokHoldings.get(url)
    if(holding?.token.mime_type === null) return false
    return holding?.token.mime_type.includes("video");
}

export function extractURLsFromTezTokHoldings(tezTokHoldings: Map<string, TezTokHolding>) {
    return Array.from(tezTokHoldings.keys()).filter(url => url !== null)
}

export function extractImageURLsFromTezTokHolding(tezTokHoldings: Map<string, TezTokHolding>) {
    return extractURLsFromTezTokHoldings(tezTokHoldings).filter(x => isImageURL(tezTokHoldings, x))
}

export function extractVideoURLsFromTezTokHolding(tezTokHoldings: Map<string, TezTokHolding>) {
    return extractURLsFromTezTokHoldings(tezTokHoldings).filter(x => isVideoURL(tezTokHoldings, x))
}
