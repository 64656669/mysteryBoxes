// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMysteryBox.sol";

/**
 * @title Opener
 * @dev A contract for opening mystery boxes and rewarding users with tokens.
 */
contract Opener {
    using SafeMath for uint256;

    uint256 public percentageDropToken = 30;

    /**
     * @dev Emitted when a specific function is called, providing the gas used for that function.
     * @param func The name of the function.
     * @param gas The amount of gas used.
     */
    event Log(string func, uint256 gas);

    /**
     * @dev Emitted when a token reward is given to the user.
     * @param id_amount The amount of tokens rewarded.
     * @param _contract The address of the token contract.
     */
    event LogTokenReward(uint256 id_amount, address _contract);

    /**
     * @dev Emitted when an NFT reward is given to the user.
     * @param id_amount The amount of NFTs rewarded.
     * @param _contract The address of the NFT contract.
     */
    event LogNFTReward(uint256 id_amount, address _contract);

    /**
     * @dev Emitted when no token reward is available.
     * @param message The message indicating the absence of token reward.
     */
    event LogNoTokenReward(string message);

    /**
     * @dev Emitted when no NFT reward is available.
     * @param message The message indicating the absence of NFT reward.
     */
    event LogNoNFTReward(string message);

    /**
     * @dev Initializes the contract.
     */
    constructor() {}

    /**
     * @dev Generates a random number based on the previous block hash and current timestamp.
     * @param modulo The modulus for generating the random number.
     * @return A random number.
     */
    function random(uint256 modulo) private view returns (uint256) {
        uint256 _random = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));
        return _random % modulo;
    }

    /**
     * @dev Opens a mystery box and rewards the user with tokens.
     * @param _mysteryBoxAddress The address of the mystery box contract.
     * @param addressKey The address of the key contract.
     * @param keyID The ID of the key.
     */
    function openBox(address _mysteryBoxAddress, address addressKey, uint256 keyID) public {
        address mysteryKeyAddress = IMysteryBox(_mysteryBoxAddress).keyContract();

        uint256 targetKeyQuantity = IMysteryBox(_mysteryBoxAddress).initKeyQuantity().mul(percentageDropToken).div(100);
        uint256 tokensCounter = IMysteryBox(_mysteryBoxAddress).tokensCounter();
        uint256 tokensQtyRewardTarget = tokensCounter.div(targetKeyQuantity);

        require(
            addressKey == mysteryKeyAddress,
            "wrong key contract address"
        );

        require(
            IERC721(addressKey).ownerOf(keyID) == msg.sender,
            "not owner of this Key"
        );

        IMysteryBox(_mysteryBoxAddress).transferNFT(addressKey, msg.sender, _mysteryBoxAddress, keyID);

        rewardToken(_mysteryBoxAddress, tokensQtyRewardTarget);
    }

    /**
     * @dev Rewards the user with tokens based on the outcome.
     * @param _mysteryBoxAddress The address of the mystery box contract.
     * @param tokensQtyRewardTarget The target quantity of tokens to be rewarded.
     */
    function rewardToken(address _mysteryBoxAddress, uint256 tokensQtyRewardTarget) public {
        uint256 indexToken;
        address tokenAddress;
        uint256 randomIndexToken = random(100);
        uint256 tokenTypes = IMysteryBox(_mysteryBoxAddress).tokenRewardsType();

        for (uint256 i = 0; i < tokenTypes; i++) {
            (, uint256 _amount, , address _address) = IMysteryBox(_mysteryBoxAddress).rewardTokens(i);
            if (_amount >= tokensQtyRewardTarget) {
                tokenAddress = _address;
                indexToken = i;
                break;
            }
        }
        if (tokenAddress != address(0) && randomIndexToken <= percentageDropToken) {
            IMysteryBox(_mysteryBoxAddress).transferTokens(tokenAddress, msg.sender, tokensQtyRewardTarget);
            IMysteryBox(_mysteryBoxAddress).updateRewardTokens(indexToken, tokensQtyRewardTarget);
            emit LogTokenReward(tokensQtyRewardTarget, tokenAddress);
        } else {
            emit LogNoTokenReward("TOKEN");
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
