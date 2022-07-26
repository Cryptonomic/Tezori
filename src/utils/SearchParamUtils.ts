var outputQueryString: string

export function updateAddressQueryParams(hasAddressQuery: boolean, queryString: string, globalStateAddress: string) {
    if(!hasAddressQuery) { 
            outputQueryString = globalStateAddress
    }
        else if(hasAddressQuery && queryString !== globalStateAddress)
        {   
            outputQueryString = globalStateAddress
        }

    return (
         {a: outputQueryString} // for input into setSearchParams()
    )
}