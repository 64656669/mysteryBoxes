import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ConnectWalletContext } from '../../Contexts/ConnectWalletContext.js';
import NewEdition from '../../components/NewEdition/NewEdition.js';
import OpenEdition from '../../components/OpenEdition/OpenEdition.js';
import New from '../../components/MysteryBox/New.js'
import Deployed from '../../components/MysteryBox/Deployed.js'
import Open from '../../components/MysteryBox/Open.js'

import './Header.scss';

function Header () {
    const { contract, key } = useParams();
    const {ConnectState} = useContext(ConnectWalletContext);

    const openModal = () => {
        if(contract && key) {
            console.log(contract, key, ConnectState.address);
            return <Deployed  addressBox= {contract} addressKey= {key} addressTo={ConnectState.address} />;
        }
        return <><New /><Open /></>;
    }

    return (
        <section className="header">
            <div className='mask'/>
            <div className='titles'>
                <h3>Beta</h3>
                <h2>Stimulate your web3 community<br/> with <b>Mystery Boxes</b></h2>
            </div>
            <div className="button-edition">
                <NewEdition alt="newedition" />
                <OpenEdition alt="openedition" />
            </div>
            { openModal() }
        </section>
    );
}

export default Header;