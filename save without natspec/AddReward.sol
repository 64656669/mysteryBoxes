// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMysteryBox.sol";

contract AddReward {

    event Log(string func, uint gas);

    constructor(){}

    function addReward(bool _type, address addressContractReward, address to, uint256 id_or_quantity) public{
        if(_type == false){
            IERC20(addressContractReward).transferFrom(msg.sender,to, id_or_quantity);
            // adding TOKEN reward
            IMysteryBox(to).addReward(false, id_or_quantity,addressContractReward);
        } else{
            IERC721(addressContractReward).safeTransferFrom(msg.sender,to, id_or_quantity);
            // adding NFT reward
            IMysteryBox(to).addReward(true, id_or_quantity,addressContractReward);
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