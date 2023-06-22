//import './newEdition.css';
import React, { useContext } from 'react';
import { ConnectWalletContext } from '../../Contexts/ConnectWalletContext.js'
import { EthersContext } from '../../Contexts/EthersContext.js'
import { NewMysteryBoxContext } from '../../Contexts/NewMysteryBoxContext.js'
import { MysteryEditionContext } from '../../Contexts/MysteryEditionContext.js'

import './NewEdition.scss';

const ethers = require("ethers") ;

function  NewEdition(){
    //context
    const {ConnectState} = useContext(ConnectWalletContext);
    const {setMysteryButtonState} = useContext(NewMysteryBoxContext);
    const {MysteryEditionState} = useContext(MysteryEditionContext);

    function onClickEdition() {
        setMysteryButtonState(true);
    };

    return(
    <div className='newEdition'>
        { ConnectState.state
            ? <button onClick={() => onClickEdition()}>
                <span className="line"></span>
                    New Mystery Box  edition
                </button>
            : <></>
            } 
    </div>
    );
}


export default NewEdition;