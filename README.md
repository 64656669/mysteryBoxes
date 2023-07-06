**Mystery Boxes**

This project is written as part of a final project for a french certification program (RS5000 certification).

The objective is to demonstrate the skills acquired during the training while presenting an MVP (Minimum Viable Product) of the BoX project.

The BoX project explores the creation and opening of mystery boxes containing tokens and NFTs, as well as gamification mechanisms to stimulate user engagement in the web3 environment.

The smart contracts are developed in Solidity, tested, and deployed on the Polygon blockchain using the Hardhat environment. The front-end is coded in Javascript, utilizing the React library.

__Note: these contracts have been created for a POC, and cannot be used as they stand in production. Security issues are remaining and need to be addressed__

![IMAGE_DESCRIPTION](https://github.com/64656669/mysteryBoxes/blob/main/app/src/styles/img/jungle.png)

**Overview**

The application is developed in React JS.

The blockchain used is Polygon, specifically its Mumbai test network. Interaction with the Polygon network is made possible through MetaMask and the Ethers.js package.

The smart contracts are developed using the Solidity language, which allows for coding smart contracts compatible with blockchains using the EVM (Ethereum Virtual Machine).

The metadata of the NFTs and the associated images are managed using FileBase and the IPFS (InterPlanetary File System) protocol.

The mystery keys are accessible and viewable on OpenSea. The mystery boxes for each edition are not ERC-721 tokens, but rather arrays of rewards within each mystery box contract. Since the keys are already NFTs, there was no need to manage the mystery boxes as ERC-721 tokens for the MVP.

The development environment used is Hardhat.

**Smart contracts**

To summarize the functionality of the different smart contracts:

- The "Manager," "Opener," "AddRewards," "MysteryBox," and "MysteryKey" contracts are Solidity smart contracts that interact to enable the creation, management, and opening of mystery boxes containing rewards (NFTs, Tokens).
- These smart contracts are deployed on the Polygon Mumbai chain.
- They have been developed in a hardhat environment and tested using the chai package within the same environment.
- The "Manager" contract is primarily responsible for initializing each new edition of mystery boxes by systematically creating a new "MysteryBox" contract and the associated number of keys via the "MysteryKey" contract.
- It allows for the addition of new rewards to a specific mystery box using the "AddRewards" contract.
- The "Opener" contract enables users to use mystery box keys to open a box and claim the associated rewards.
- The "MysteryBox" contract represents a specific mystery box that can contain ERC20 tokens and NFTs.
- The "MysteryKey" contract represents an ERC-721 contract and allows for the generation of a collection of NFTs that inherit from the ERC721 contract provided by @openzeppelin. This collection represents the various mystery keys used to open mystery boxes and claim the rewards.
