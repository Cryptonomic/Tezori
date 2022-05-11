import * as React from "react";

type Props = {
    address: string;
};

export function Gallery(props: Props) {
    return (
        <h1 id="address">{props.address}</h1>
    );
}