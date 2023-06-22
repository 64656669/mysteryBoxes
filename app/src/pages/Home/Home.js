import Menu from '../../components/Menu/Menu';
import Header from '../../components/Header/Header';
import Intro from '../../components/Intro/Intro';
import HowTo from '../../components/HowTo/HowTo';
import ModalNewMysteryBox from '../../components/MysteryBox/ModalNewMysteryBox.js'
import ModalOpenMysteryBox from '../../components/MysteryBox/ModalOpenMysteryBox.js'

import './Home.scss';

function Home () {
    return (
        <div className="home">
            <ModalNewMysteryBox/>
            <ModalOpenMysteryBox/>
            <Menu alt="menu"/>
            <Header />
            <Intro />
            <HowTo />
        </div>
    );
}
export default Home;