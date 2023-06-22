// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


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
    struct Box{
        address opener;
        Reward[] _rewards;
    }
    // Array
    Reward[] public rewardsPool;
    Reward[] public rewardNFTs;
    Reward[] public rewardTokens; 
    //constructor
    constructor(string memory _editionName, uint8 _keyQuantity, address _keyContract, address _opener, address _addreward) payable {
        editionName = _editionName;
        initKeyQuantity = _keyQuantity;
        keyContract = _keyContract;
        opener = _opener;
        addreward = _addreward;
    }
    // Modifiers
    modifier openerAddress() {
        require(opener == msg.sender,
        "Not valid address");
        _;
    }
    modifier addRewardAddress() {
        require(addreward == msg.sender,
        "Not valid address");
        _;
    }
    // functions
    function updateRewardTokens(uint index, uint amount) public{
        rewardTokens[index]._amount_id = rewardTokens[index]._amount_id - amount;
    }

    function getRewardsPool() public view returns (Reward[] memory allRewards){
        return rewardsPool;
    }

    function transferNFT(address erc721, address from, address to, uint ID) public openerAddress(){
        IERC721(erc721).safeTransferFrom(from, to, ID);
    }

    function transferTokens(address erc20, address to, uint qty ) public openerAddress(){
        IERC20(erc20).transfer(to,qty);
    }

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