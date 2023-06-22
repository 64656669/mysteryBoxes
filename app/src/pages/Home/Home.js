import { useParams } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Header from '../../components/Header/Header';
import Intro from '../../components/Intro/Intro';
import HowTo from '../../components/HowTo/HowTo';

import './Home.scss';

function Home () {

    return (
        <div className="home">
            <Menu alt="menu"/>
            <Header />
            <Intro />
            <HowTo />
        </div>
    );
}
export default Home;