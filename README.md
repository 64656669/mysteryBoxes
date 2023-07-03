#Mystery Boxes

This project is written as part of a final project for a french certification program (RS5000 certification).

The objective is to demonstrate the skills acquired during the training while presenting an MVP (Minimum Viable Product) of the BoX project.

The BoX project explores the creation and opening of mystery boxes containing tokens and NFTs, as well as gamification mechanisms to stimulate user engagement in the web3 environment.

The smart contracts are developed in Solidity, tested, and deployed on the Polygon blockchain using the Hardhat environment. The front-end is coded in Javascript, utilizing the React library.

#Overview

The application is developed in React JS.

The blockchain used is Polygon, specifically its Mumbai test network. Interaction with the Polygon network is made possible through MetaMask and the Ethers.js package.

The smart contracts are developed using the Solidity language, which allows for coding smart contracts compatible with blockchains using the EVM (Ethereum Virtual Machine).

The metadata of the NFTs and the associated images are managed using FileBase and the IPFS (InterPlanetary File System) protocol.

The mystery keys are accessible and viewable on OpenSea. The mystery boxes for each edition are not ERC-721 tokens, but rather arrays of rewards within each mystery box contract. Since the keys are already NFTs, there was no need to manage the mystery boxes as ERC-721 tokens for the MVP.

The development environment used is Hardhat.
