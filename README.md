# Tezori - A whitelabel wallet framework for Tezos

[![Node.js CI](https://github.com/Cryptonomic/Tezori/actions/workflows/node.js.yml/badge.svg)](https://github.com/Cryptonomic/Tezori/actions/workflows/node.js.yml)
[![Dependency Review](https://github.com/Cryptonomic/Tezori/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/Cryptonomic/Tezori/actions/workflows/dependency-review.yml)

## Overview

Tezori is a whitelabel wallet framework for the [Tezos](https://tezos.com) blockchain. 

Most notably, Tezori is used for deploying the [Galleon wallet](https://cryptonomic.tech/galleon.html). 

The main branch for the third generation of the project is `trunk`. The current generation is actively under development and therefore at an early stage right now. 

For the first generation of the product, see the `main` branch. For the second generation, see the [T2](https://github.com/Cryptonomic/T2) repo.

Tezori is built using Node.js, React.js and Typescript.

## Build and run

This project is meant to be run using Node.js v16.

First, install all dependencies:

`npm install`

Then, to run the web application, run:

`npm run dev`

To build a deployable web application, run:

`npm run build`

To run the app as a native Electron.js application, run:

`npm run electron-dev`

to build a deployable native application using Electron.js, run:

`npm run electron-package`