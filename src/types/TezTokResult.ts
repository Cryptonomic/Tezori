/***
 * Interfaces for parsing results from the TezTok NFT indexer.
 */

export default interface TezTokResult {
    data: TezTokHoldings
}

export interface TezTokHoldings {
    holdings: TezTokHolding[]
}
export interface TezTokHolding {
    holder_address: string,
    token: TezTokToken
}

export interface TezTokToken {
    artist_profile: TezTokArtistProfile,
    artifact_uri: string,
    description: string,
    name: string,
    platform: string,
    mime_type: string
}

export interface TezTokArtistProfile {
    account: string,
    alias: string
}
