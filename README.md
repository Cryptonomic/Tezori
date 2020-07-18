# Please note that this repository is now deprecated in favor of [T2](https://github.com/Cryptonomic/T2)!

# Tezori

A wallet for the Tezos blockchain based on [Conseil](https://github.com/Cryptonomic/Conseil) and [ConseilJS](https://github.com/Cryptonomic/ConseilJS).

This code was written for the community. Use it, hack it, fork it as you please!

[![Build Status](https://travis-ci.org/Cryptonomic/Tezori.svg?branch=master)](https://travis-ci.org/Cryptonomic/Tezori)
[![Coverage Status](https://coveralls.io/repos/github/Cryptonomic/Tezori/badge.svg?branch=master)](https://coveralls.io/github/Cryptonomic/Tezori?branch=master)

## Development

The wallet is built on [React](https://reactjs.org/) and [Electron](https://electronjs.org/) and uses [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

Active development happens on the develop branch with periodic merges to master.

Add the file `extraResources/defaultWalletNodes.json` with your Tezos and Conseil nodes:

```json
{
  "tezosSelectedNode": "Cryptonomic-Nautilus",
  "conseilSelectedNode": "Cryptonomic-Conseil",
  "list": [
    {
      "name": "MyTezosNode",
      "type": "TEZOS",
      "url": "https://mytezosnode.com/",
      "apiKey": "anapikey"
    },
    {
      "name": "MyConseilNode",
      "type": "CONSEIL",
      "url": "https://myconseilnode.com/",
      "apiKey": "anotherapikey"
    }
  ],
  "selectedPath": "Default",
  "pathsList": [
    {
      "label": "Default",
      "derivation": "44'/1729'/0'/0'/0'"
    }
  ]
}

```

To install all dependencies:

`yarn`

To run during development:

`npm run dev`

To package for deployment:

`npm run package-all`
