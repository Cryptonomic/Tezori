"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
function runQuery(network, command, payload) {
    if (payload === void 0) { payload = {}; }
    var url = "http://nautilus.cryptonomic.tech:8732/tezos/" + network + "/" + command;
    //const url = `http://localhost:8732/${command}`;
    var payloadStr = JSON.stringify(payload);
    console.log("Querying Tezos node with URL " + url + " and payload: " + payloadStr);
    return node_fetch_1["default"](url, {
        method: 'post',
        body: payloadStr,
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
        console.log("Reponse from Tezos node: " + JSON.stringify(json));
        return new Promise(function (resolve) { return resolve(json); });
    });
}
exports.runQuery = runQuery;
