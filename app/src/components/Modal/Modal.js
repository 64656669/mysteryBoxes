//import './newEdition.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.scss';
import Loading from '../Loading/Loading.js'

function Modal(props){
    const [isOpen, setIsOpen] = useState(props.isOpen);
    const navigate = useNavigate();

    const onClose = () => {
        setIsOpen(false);
        navigate(`/`);
    }

    if(!isOpen) return;

    return(
        <div className={ "modal " + props.classes }>
            <div className="modal-dialog modal-dialog-centered">
                <div className="close" onClick={ () => onClose() }>x</div>
                { props.isLoading
                    ? <Loading/>
                    : props.content
                }   
            </div>
        </div>   
    );
}

export default Modal;


