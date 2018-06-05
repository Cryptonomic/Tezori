"use strict";
exports.__esModule = true;
var querystring = require("querystring");
var node_fetch_1 = require("node-fetch");
function queryConseilServer(network, command, payload) {
    var https = require("https");
    var agent = new https.Agent({
        rejectUnauthorized: false
    });
    var url = "https://conseil.cryptonomic.tech:1337/tezos/" + network + "/" + command;
    return node_fetch_1["default"](url, {
        method: 'get',
        headers: {
            "apiKey": "hooman"
        },
        agent: agent
    })
        .then(function (response) { return response.json(); });
}
exports.queryConseilServer = queryConseilServer;
function sanitizeFilter(filter) {
    return {
        limit: filter.limit,
        block_id: filter.block_id.filter(Boolean),
        block_level: filter.block_level.filter(Boolean),
        block_netid: filter.block_netid.filter(Boolean),
        block_protocol: filter.block_protocol.filter(Boolean),
        operation_id: filter.operation_id.filter(Boolean),
        operation_source: filter.operation_source.filter(Boolean),
        operation_group_kind: filter.operation_group_kind.filter(Boolean),
        operation_kind: filter.operation_kind.filter(Boolean),
        account_id: filter.account_id.filter(Boolean),
        account_manager: filter.account_manager.filter(Boolean),
        account_delegate: filter.account_delegate.filter(Boolean)
    };
}
exports.sanitizeFilter = sanitizeFilter;
function queryConseilServerWithFilter(network, command, filter) {
    var params = querystring.stringify(sanitizeFilter(filter));
    var cmdWithParams = command + "?" + params;
    return queryConseilServer(network, cmdWithParams, '');
}
exports.queryConseilServerWithFilter = queryConseilServerWithFilter;
