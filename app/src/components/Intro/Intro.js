import './Intro.scss';

function Intro () {
    return (
        <section className="intro">
            <div className='title'>Unleash the power of <span>gamification</span> with your community </div>
            <div className='subtitle'>Empowering Web3 through vibrant community engagement is crucial. Gamification emerges as the perfect solution, fueling active participation and unlocking endless possibilities.</div>
            <div className='list'>
                <div className='item'>
                    <div className='name'>CREATE</div>
                    <div className='text'>Mystery Boxes in a Decentralized way, with a few clics </div>
                </div>
                <div className='item'>
                    <div className='name'>ADD</div>
                    <div className='text'>Add rewards inside, such as Tokens and NFTs</div>
                </div>
                <div className='item'>
                    <div className='name'>RECEIVE</div>
                    <div className='text'>Receive Mystery Keys NFTs</div>
                </div>
                <div className='item'>
                    <div className='name'>GROW</div>
                    <div className='text'>Distribute the Keys as rewards to your community engagement.</div>
                </div>
            </div>
        </section>
    );
}

export default Intro;