import {ConseilTezosDomainsClient} from "@tezos-domains/conseil-client";

//Utility functions for working with Tezos Domains

/**
 * Gets the Tezos Domain for a given address.
 * @param tezosAddress  The given Tezos address
 * @param tezosNode Tezos node for RPC calls
 * @param tezosNetwork  Active Tezos network
 */
export function getTezosDomainForAddress(tezosAddress: string, tezosNode: string, tezosNetwork: string) {
    const client = new ConseilTezosDomainsClient({
        conseil: { server: tezosNode },
        network: tezosNetwork,
        caching: { enabled: false },
    });
    return client.resolver.resolveAddressToName(tezosAddress)
}

/**
 * Gets the Tezos address for a given Tezos domain.
 * @param tezosDomain  The given Tezos domain
 * @param tezosNode Tezos node for RPC calls
 * @param tezosNetwork  Active Tezos network
 */
export function getAddressForTezosDomain(tezosDomain: string, tezosNode: string, tezosNetwork: string) {
    const client = new ConseilTezosDomainsClient({
        conseil: { server: tezosNode },
        network: tezosNetwork,
        caching: { enabled: false },
    });
    return client.resolver.resolveNameToAddress(tezosDomain)
}
