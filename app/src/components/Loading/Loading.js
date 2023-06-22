import React from 'react';
import "./Loading.css";


function Loading() {
    return(
        <div class="loading">
            <h5>Please, validate transaction and wait until validation</h5>
            <div class="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Loading;