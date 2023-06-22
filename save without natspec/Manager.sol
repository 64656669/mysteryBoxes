// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./MysteryBox.sol";
import "./MysteryKey.sol";

interface IMysteryKey{
    function safeMint(address to, string memory uri) external;
}

contract Manager {
    event LogAddressReceiver(address addressEdition);
    event LogAddressBox(address addressEdition);
    event LogAddressKey(address addressEdition);

    address[] editions;
    address[] keys;
    address opener;
    address addReward;

    constructor(address _opener, address _addReward){
        opener = _opener;
        addReward = _addReward;
    } 
    
    function getKeyAmount(address _contract) public view returns(uint Balance) {
        Balance = IERC721(_contract).balanceOf(msg.sender);
    }
    
    function getMysteryBoxes() public view returns(address[] memory){
        return editions;
    }

    function getMysteryKeys() public view returns(address[] memory){
        return keys;
    }
    function createEdition(string memory editionName, uint8 quantity) public{

        //creation of Mystery Key contract
        MysteryKey Key = new MysteryKey();
        for (uint i = 0; i < quantity; i++) {
            IMysteryKey(address(Key)).safeMint(msg.sender,'QmYLofW91SjNXmkkEBhFV9PtKqBSd3WdcgJAyrB4zkbxCy');
        }
        keys.push(address(Key));
        emit LogAddressKey(address(Key));
        emit LogAddressReceiver(address(msg.sender));

        //creation of Mystery Box contract
        MysteryBox Edition = new MysteryBox(editionName, quantity, address(Key),opener,addReward);
        editions.push(address(Edition));
        emit LogAddressBox(address(Edition));
    }
}