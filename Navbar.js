import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Fichier CSS pour le style

const Navbar = () => {
    const location = useLocation();

    // Vérifie si le lien est actif
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return ( <
        nav className = "navbar" >
        <
        div className = "nav-links" >
        <
        Link to = "/"
        className = { `nav-link ${isActive('/')}` } >
        Home <
        /Link> <
        Link to = "/dashboard"
        className = { `nav-link ${isActive('/dashboard')}` } >
        Dashboard <
        /Link> <
        Link to = "/tontines"
        className = { `nav-link ${isActive('/tontines')}` } >
        Tontines <
        /Link> <
        Link to = "/create-tontine"
        className = { `nav-link ${isActive('/create-tontine')}` } >
        Créer une tontine <
        /Link> <
        /div> <
        /nav>
    );
};

export default Navbar;