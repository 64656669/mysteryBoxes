// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IMysteryBox {
    function rewardTokens(uint index) external view returns(uint8 _type,uint256 _amount_id, bool dropped,address _contract);
    function rewardNFTs(uint index) external view returns(uint8 _type,uint256 _amount_id, bool dropped,address _contract);
    function addReward(bool _type, uint256 _amount_id, address _address) external;
    function initKeyQuantity () external view returns (uint qty);
    function currentKeyQuantity () external view returns (uint qty);   
    function setKeyQuantity () external;
    function nftRewardsCount() view external returns (uint _nftRewardsCount);
    function tokensCounter() view external returns (uint _tokensCounter);
    function keyContract() view external returns (address keyAddress); 
    function transferNFT(address erc721, address from,address to, uint ID ) external;
    function transferTokens(address erc20, address to, uint qty) external;
    function updateRewardTokens(uint index, uint amount) external;
    function tokenRewardsType() external view returns(uint tokenTypes);
}