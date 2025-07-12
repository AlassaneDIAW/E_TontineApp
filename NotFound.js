import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return ( < div className = "not-found-container" >
        <
        div className = "not-found-content" >
        <
        FaExclamationTriangle className = "error-icon" / >
        <
        h1 > 404 - Page non trouvée < /h1>  <
        p > La page que vous recherchez n 'existe pas ou a été déplacée.</p>  <
        button onClick = {
            () => navigate('/')
        }
        className = "home-button" >
        <
        FaHome / > Retour à l 'accueil  <
        /button>  <
        /div>  <
        /div>
    );
};

export default NotFound;