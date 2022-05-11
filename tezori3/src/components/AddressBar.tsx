import * as React from "react";

type Props = {
    defaultAddress: string;
};

export function AddressBar(props: Props) {
    return (
        <h1 id="address">{props.defaultAddress}</h1>
    );
}