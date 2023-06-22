import NewEdition from '../../components/NewEdition/NewEdition.js';
import OpenEdition from '../../components/OpenEdition/OpenEdition.js';

import './Header.scss';

function Header () {
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
        
        </section>
    );
}

export default Header;