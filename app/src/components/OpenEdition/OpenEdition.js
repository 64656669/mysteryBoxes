//import './newEdition.css';
import React, { useState, useContext } from 'react';
import { ConnectWalletContext } from '../../Contexts/ConnectWalletContext.js'
import { OpenEditionBtnContext } from '../../Contexts/OpenEditionBtnContext.js'
import {CONTRACT_ADDRESS_MANAGER, CONTRACT_ABI_MANAGER} from '../../config.js'
import { EthersContext } from '../../Contexts/EthersContext.js'
import { MysteryBoxListContext} from '../../Contexts/MysteryBoxListContext.js'

import './OpenEdition.scss';

const ethers = require("ethers") ;

function  OpenEdition(){
    //context
    const {EthersDetails} = useContext(EthersContext);
    const {ConnectState} = useContext(ConnectWalletContext);
    const {setOpenEditionButtonState} = useContext(OpenEditionBtnContext);

    //
    const {mysteryBoxList,setmysteryBoxList} = useContext(MysteryBoxListContext);
    const {mysteryKeyList,setmysteryKeyList} = useContext(MysteryBoxListContext);

    const addressContractManager = CONTRACT_ADDRESS_MANAGER;
    const abi = CONTRACT_ABI_MANAGER;
    const signer = EthersDetails.signer;
    
    async function contractConnection(){
        const _contract = new ethers.Contract(addressContractManager, abi , signer);
        setmysteryBoxList(await _contract.getMysteryBoxes());
        setmysteryKeyList(await _contract.getMysteryKeys());
        console.log(mysteryBoxList);
    }
        
    
    function onClickEdition() {
        contractConnection()
        setOpenEditionButtonState(true);
    };
    return(
    <div className='OpenEdition'>
        { ConnectState
            ? <button onClick={() => onClickEdition()}>
                <span className="line"></span>
                    Open a Mystery Box 
                </button>
            : <></>
            } 
    </div>
    );
}


export default OpenEdition;