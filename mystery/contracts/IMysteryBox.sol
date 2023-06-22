// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/**
 * @title IMysteryBox
 * @dev Interface for the MysteryBox contract.
 */
interface IMysteryBox {
    /**
     * @dev Retrieves the details of a reward token at the specified index.
     * @param index The index of the reward token
     * @return _type The type of the reward token (NFT or TOKEN)
     * @return _amount_id The amount or ID of the reward token
     * @return dropped A boolean indicating if the reward has been dropped
     * @return _contract The address of the reward token contract
     */
    function rewardTokens(uint index) external view returns (
        uint8 _type,
        uint256 _amount_id,
        bool dropped,
        address _contract
    );

    /**
     * @dev Retrieves the details of a reward NFT at the specified index.
     * @param index The index of the reward NFT
     * @return _type The type of the reward NFT (NFT or TOKEN)
     * @return _amount_id The amount or ID of the reward NFT
     * @return dropped A boolean indicating if the reward has been dropped
     * @return _contract The address of the reward NFT contract
     */
    function rewardNFTs(uint index) external view returns (
        uint8 _type,
        uint256 _amount_id,
        bool dropped,
        address _contract
    );

    /**
     * @dev Adds a reward to the MysteryBox.
     * @param _type The type of the reward (NFT or TOKEN)
     * @param _amount_id The amount or ID of the reward
     * @param _address The address of the reward contract
     */
    function addReward(bool _type, uint256 _amount_id, address _address) external;

    /**
     * @dev Retrieves the initial quantity of keys for the MysteryBox.
     * @return qty The initial quantity of keys
     */
    function initKeyQuantity() external view returns (uint qty);

    /**
     * @dev Retrieves the current quantity of keys for the MysteryBox.
     * @return qty The current quantity of keys
     */
    function currentKeyQuantity() external view returns (uint qty);

    /**
     * @dev Sets the quantity of keys for the MysteryBox.
     */
    function setKeyQuantity() external;

    /**
     * @dev Retrieves the count of reward NFTs in the MysteryBox.
     * @return _nftRewardsCount The count of reward NFTs
     */
    function nftRewardsCount() external view returns (uint _nftRewardsCount);

    /**
     * @dev Retrieves the count of reward tokens in the MysteryBox.
     * @return _tokensCounter The count of reward tokens
     */
    function tokensCounter() external view returns (uint _tokensCounter);

    /**
     * @dev Retrieves the address of the key contract associated with the MysteryBox.
     * @return keyAddress The address of the key contract
     */
    function keyContract() external view returns (address keyAddress);

    /**
     * @dev Transfers a reward NFT from one address to another.
     * @param erc721 The address of the reward NFT contract
     * @param from The address from which to transfer the NFT
     * @param to The address to which to transfer the NFT
     * @param ID The ID of the NFT to transfer
     */
    function transferNFT(address erc721, address from, address to, uint ID) external;

    /**
     * @dev Transfers a quantity of reward tokens from one address to another.
     * @param erc20 The address of the reward token contract
     * @param to The address to which to transfer the tokens
     * @param qty The quantity of tokens to transfer
     */
    function transferTokens(address erc20, address to, uint qty) external;

    /**
     * @dev Updates the amount of a reward token at the specified index.
     * @param index The index of the reward token
     * @param amount The new amount of the reward token
     */
    function updateRewardTokens(uint index, uint amount) external;

    /**
     * @dev Retrieves the count of reward token types in the MysteryBox.
     * @return tokenTypes The count of reward token types
     */
    function tokenRewardsType() external view returns (uint tokenTypes);
}
