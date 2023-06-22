// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title MysteryBox
 * @dev The MysteryBox contract represents a box containing rewards, which can be either ERC721 tokens or ERC20 tokens.
 * The box can be opened by the opener contract, who can transfer the rewards to the intended key holder.
 */

contract MysteryBox is IERC721Receiver {
    // events
    event Log(string func, uint gas);
    // variables
    string editionName; 
    uint public initKeyQuantity;
    uint public KeyQuantity;
    address public keyContract;
    address opener;
    address addreward;
    uint public nftRewardsCount;
    uint public tokensCounter;
    uint public tokenRewardsType;
    //enum
    enum Type{
        NFT,
        TOKEN
    }
    //struct
    struct Reward {
        Type _type;
        uint256 _amount_id;
        bool dropped;
        address _address;
    }
    // Array
    Reward[] public rewardsPool;
    Reward[] public rewardNFTs;
    Reward[] public rewardTokens; 
    //constructor
    /**
     * @dev Constructor function
     * @param _editionName The name of the edition
     * @param _keyQuantity The initial quantity of keys for the edition
     * @param _keyContract The address of the key contract associated with the edition
     * @param _opener The address of the opener who can open the box and distribute rewards
     * @param _addreward The address of the contract that can add rewards to the box
     */
    constructor(string memory _editionName, uint8 _keyQuantity, address _keyContract, address _opener, address _addreward) payable {
        editionName = _editionName;
        initKeyQuantity = _keyQuantity;
        keyContract = _keyContract;
        opener = _opener;
        addreward = _addreward;
    }
    // Modifiers
    /**
     * @dev Modifier to check if the caller is the designated opener
     */
    modifier openerAddress() {
        require(opener == msg.sender,
        "Not valid address");
        _;
    }
     /**
     * @dev Modifier to check if the caller is the contract that can add rewards
     */
    modifier addRewardAddress() {
        require(addreward == msg.sender,
        "Not valid address");
        _;
    }
    // functions
    /**
     * @dev Updates the amount of tokens for a specific reward index
     * @param index The index of the reward to update
     * @param amount The new amount of tokens
     */
    function updateRewardTokens(uint index, uint amount) public{
        rewardTokens[index]._amount_id = rewardTokens[index]._amount_id - amount;
    }
    /**
     * @dev Returns all the rewards in the rewards pool
     * @return allRewards An array containing all the rewards in the rewards pool
     */
    function getRewardsPool() public view returns (Reward[] memory allRewards){
        return rewardsPool;
    }
    /**
     * @dev Transfers an ERC721 token from one address to another
     * @param erc721 The address of the ERC721 contract
     * @param from The address from which to transfer the token
     * @param to The address to which the token should be transferred
     * @param ID The ID of the token to transfer
     */
    function transferNFT(address erc721, address from, address to, uint ID) public openerAddress(){
        IERC721(erc721).safeTransferFrom(from, to, ID);
    }
    /**
     * @dev Transfers ERC20 tokens from one address to another
     * @param erc20 The address of the ERC20 contract
     * @param to The address to which the tokens should be transferred
     * @param qty The quantity of tokens to transfer
     */
    function transferTokens(address erc20, address to, uint qty ) public openerAddress(){
        IERC20(erc20).transfer(to,qty);
    }
    /**
     * @dev Adds a reward to the rewards pool
     * @param _type The type of the reward (NFT or TOKEN)
     * @param _amount_id The amount or ID of the reward
     * @param _address The address of the reward contract
     */
    function addReward(bool _type, uint256 _amount_id, address _address) public addRewardAddress(){
        if(_type == false){
            rewardsPool.push(Reward(Type.TOKEN,_amount_id,false,_address));
            rewardTokens.push(Reward(Type.TOKEN,_amount_id,false,_address));
            ++tokenRewardsType;
            tokensCounter = tokensCounter + _amount_id;
        }else {
            rewardsPool.push(Reward(Type.NFT,_amount_id,false,_address));
            rewardTokens.push(Reward(Type.NFT,_amount_id,false,_address));
            ++nftRewardsCount;
        }
    }
    /*
     * To Receive ERC 721
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    // Fallback function
    fallback() external payable {
        emit Log("fallback", gasleft());
    }
}