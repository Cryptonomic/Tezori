import TezTokResult from "../types/TezTokResult";

const getTezTokServerURL = () => {return "https://api.teztok.com/v1/graphql";}

export interface AnnotatedTezTokResults {
    tezTokResult:   TezTokResult,
    contentURLs:    Set<string>
}

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
            }
          }
        }
        `
        }
    }

export const queryTezTok = async (holder: string): Promise<AnnotatedTezTokResults> => {
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
    return {
        tezTokResult: tezTokResult,
        contentURLs: contentURLs
    }
}

export const extractContentURLSFromTezTokResults = (tezTokResult: TezTokResult) => {
    return new Set(tezTokResult.data.holdings.map(item => item.token.artifact_uri))
}
