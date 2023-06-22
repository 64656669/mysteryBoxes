//import './newEdition.css';
import React, { useState, useContext } from 'react';
import './Modal.scss';
import Loading from '../Loading/Loading.js'

function Modal(props){
    const [isOpen, setIsOpen] = useState(props.isOpen);

    if(!isOpen) return;

    return(
        <div className={ "modal " + props.classes }>
            <div className="modal-dialog modal-dialog-centered">
                <div className="close" onClick={ () => setIsOpen(false) }>x</div>
                { props.isLoading
                    ? <Loading/>
                    : props.content
                }   
            </div>
        </div>   
    );
}

export default Modal;


