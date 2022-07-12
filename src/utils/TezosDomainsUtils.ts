import {ConseilTezosDomainsClient} from "@tezos-domains/conseil-client";

export function getTezosDomainForAddress(tezosAddress: string, tezosNode: string, tezosNetwork: string) {
    const client = new ConseilTezosDomainsClient({
        conseil: { server: tezosNode },
        network: tezosNetwork,
        caching: { enabled: false },
    });
    return client.resolver.resolveAddressToName(tezosAddress)
}

export function getAddressForTezosDomain(tezosDomain: string, tezosNode: string, tezosNetwork: string) {
    const client = new ConseilTezosDomainsClient({
        conseil: { server: tezosNode },
        network: tezosNetwork,
        caching: { enabled: false },
    });
    return client.resolver.resolveNameToAddress(tezosDomain)
}
