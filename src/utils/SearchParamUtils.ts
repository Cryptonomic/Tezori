/*
Ultility Function for Updating Search Query Params
*/

/*
Sets the address query to correct value 
Based on: 
    - Whether the address query exists (boolean)
    - The current query string (string)
    - The address stored in global state (string)
*/

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
         {a: outputQueryString} // for input into setSearchParams() function
    )
}