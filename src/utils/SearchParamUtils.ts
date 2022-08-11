//Ultility Function for Updating Search Query Params

var outputQueryString: string

/**
 * Sets Address Query String to Correct Value
 * @param hasAddressQuery Whether an address query exists
 * @param queryString The current address query string
 * @param globalStateAddress The current global state address
 */
export function updateAddressQueryParams(hasAddressQuery: boolean, queryString: string, globalStateAddress: string) {
    if(!hasAddressQuery) { 
            outputQueryString = globalStateAddress
    }
        else if(hasAddressQuery && queryString !== globalStateAddress)
        {   
            outputQueryString = globalStateAddress
        }

    return (
         {a: outputQueryString} // for input into setSearchParams() function
    )
}