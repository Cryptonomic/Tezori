import TezTokResult from "../types/TezTokResult";

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
            }
          }
        }
        `
        }
    }

export const queryTezTok = async (holder: string) => {
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
    return responseJson as TezTokResult
}