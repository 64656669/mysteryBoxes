// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMysteryBox.sol";

/**
 * @title AddReward
 * @dev A contract for adding rewards to the MysteryBox contract.
 */
contract AddReward {
    /**
     * @dev Emitted when a function is called.
     * @param func The name of the function.
     * @param gas The remaining gas after the function call.
     */
    event Log(string func, uint256 gas);

    /**
     * @dev Initializes the AddReward contract.
     */
    constructor() {}

    /**
     * @dev Adds a reward to the MysteryBox contract.
     * @param _type The type of the reward (false for tokens, true for NFTs).
     * @param addressContractReward The address of the reward contract.
     * @param to The address to which the reward is added.
     * @param id_or_quantity The ID or quantity of the reward.
     */
    function addReward(bool _type, address addressContractReward, address to, uint256 id_or_quantity) public {
        if (_type == false) {
            IERC20(addressContractReward).transferFrom(msg.sender, to, id_or_quantity);
            IMysteryBox(to).addReward(false, id_or_quantity, addressContractReward);
        } else {
            IERC721(addressContractReward).safeTransferFrom(msg.sender, to, id_or_quantity);
            IMysteryBox(to).addReward(true, id_or_quantity, addressContractReward);
        }
    }
    /**
     * @dev Fallback function that allows the contract to receive ether.
     */
    fallback() external payable {
        emit Log("fallback", gasleft());
    }

    /**
     * @dev Receive function that allows the contract to receive ether when `msg.data` is empty.
     */
    receive() external payable {
        emit Log("receive", gasleft());
    }
}
