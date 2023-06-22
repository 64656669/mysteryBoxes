// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./MysteryBox.sol";
import "./MysteryKey.sol";

interface IMysteryKey{
    function safeMint(address to, string memory uri) external;
}

/**
 * @title Manager
 * @dev The Manager contract is used to manage editions of Mystery Boxes and corresponding Mystery Keys.
 */
contract Manager {
    event LogAddressReceiver(address addressEdition);
    event LogAddressBox(address addressEdition);
    event LogAddressKey(address addressEdition);

    address[] editions;
    address[] keys;
    address opener;
    address addReward;

    /**
     * @dev Constructor function
     * @param _opener The address of the opener contract
     * @param _addReward The address of the addReward contract
     */
    constructor(address _opener, address _addReward) {
        opener = _opener;
        addReward = _addReward;
    } 
    
    /**
     * @dev Get the balance of Mystery Keys for a given contract and address
     * @param _contract The address of the contract
     * @return Balance The balance of Mystery Keys
     */
    function getKeyAmount(address _contract) public view returns (uint Balance) {
        Balance = IERC721(_contract).balanceOf(msg.sender);
    }
    
    /**
     * @dev Get all the addresses of Mystery Boxes created
     * @return An array of Mystery Box addresses
     */
    function getMysteryBoxes() public view returns (address[] memory) {
        return editions;
    }

    /**
     * @dev Get all the addresses of Mystery Keys created
     * @return An array of Mystery Key addresses
     */
    function getMysteryKeys() public view returns (address[] memory) {
        return keys;
    }
    
    /**
     * @dev Create a new edition of Mystery Box and corresponding Mystery Keys
     * @param editionName The name of the edition
     * @param quantity The quantity of Mystery Keys to be created
     */
    function createEdition(string memory editionName, uint8 quantity) public {
        // Creation of Mystery Key contract
        MysteryKey Key = new MysteryKey();
        for (uint i = 0; i < quantity; i++) {
            IMysteryKey(address(Key)).safeMint(msg.sender, 'QmYLofW91SjNXmkkEBhFV9PtKqBSd3WdcgJAyrB4zkbxCy');
        }
        keys.push(address(Key));
        emit LogAddressKey(address(Key));
        emit LogAddressReceiver(address(msg.sender));

        // Creation of Mystery Box contract
        MysteryBox Edition = new MysteryBox(editionName, quantity, address(Key), opener, addReward);
        editions.push(address(Edition));
        emit LogAddressBox(address(Edition));
    }
}