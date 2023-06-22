// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMysteryBox.sol";

contract Opener {

    //
    event Log(string func, uint gas);
    event LogTokenReward(uint id_amount, address _contract);
    event LogNFTReward(uint id_amount, address _contract);
    event LogNoTokenReward(string message);
    event LogNoNFTReward(string message);
    uint percentageDropToken = 30;
    //
    constructor(){
    }
    //
    function random(uint256 modulo) private view returns (uint) {
        uint _random = uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));
        return _random % modulo;
    }

    function openBox(address _mysteryBoxAddress, address addressKey, uint256 keyID) public{

        address mysteryKeyAddress = IMysteryBox(_mysteryBoxAddress).keyContract();
        //
        uint targetKeyQuantity = SafeMath.div(SafeMath.mul(IMysteryBox(_mysteryBoxAddress).initKeyQuantity(),percentageDropToken),100);
        uint tokensCounter = IMysteryBox(_mysteryBoxAddress).tokensCounter();
        uint tokensQtyRewardTarget = SafeMath.div(tokensCounter, targetKeyQuantity);
        // test de l'adresse du contract liée à cette clé
        require(addressKey == mysteryKeyAddress,
            "wrong key contract address"
        );
        require(
            IERC721(addressKey).ownerOf(keyID) == msg.sender,
            "not owner of this Key"
        );
        // Key transfer
        IMysteryBox(_mysteryBoxAddress).transferNFT(addressKey,msg.sender, _mysteryBoxAddress, keyID);
        //
        
        rewardToken(_mysteryBoxAddress, addressKey, keyID, mysteryKeyAddress, tokensQtyRewardTarget);
        //
    }

    function rewardToken(address _mysteryBoxAddress, address addressKey, uint256 keyID, address mysteryKeyAddress, uint tokensQtyRewardTarget) public{
        //
        uint indexToken;
        address tokenAddress;
        uint randomIndexToken = random(100);
        uint tokenTypes =  IMysteryBox(_mysteryBoxAddress).tokenRewardsType();
        // taking the first token with enough quantity remaining
        for(uint256 i = 0; i < tokenTypes;){
            (,uint _amount,,address _address) = IMysteryBox(_mysteryBoxAddress).rewardTokens(i);
            if (_amount >= tokensQtyRewardTarget){
                tokenAddress = _address;
                indexToken = i;
                break;
            }
            unchecked {
                i++;
            }
        }
        // rewarding winning holders
        if(tokenAddress != address(0) && randomIndexToken <= percentageDropToken){
            //win
            // transfert ERC 20
            IMysteryBox(_mysteryBoxAddress).transferTokens(tokenAddress, msg.sender, tokensQtyRewardTarget);
            IMysteryBox(_mysteryBoxAddress).updateRewardTokens(indexToken,tokensQtyRewardTarget);
            // event
            emit LogTokenReward(tokensQtyRewardTarget, tokenAddress);
        } else {
            //lose
            emit LogNoTokenReward("TOKEN");
        }
    }
    // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        emit Log("fallback", gasleft());
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        emit Log("receive", gasleft());
    }
}  
  

    



