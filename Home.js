import React, { useState } from 'react';
import '../index.css';
import './Home.css';
import {
    FaHandHoldingUsd,
    FaBell,
    FaWallet,
    FaCalendarAlt,
    FaUsers,
    FaCoins,
    FaMoneyBillWave,
    FaHistory,
    FaCog,
    FaChevronRight,
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaHome,
    FaChartPie,
    FaComments,
    FaUser
} from 'react-icons/fa';

const Home = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(25000);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        alert(`Paiement de ${paymentAmount} FCFA envoyé !`);
        setShowPaymentModal(false);
    };

    return ( <
        div className = "home-container" > { /* Header */ } <
        header className = "app-header" >
        <
        div className = "logo" >
        <
        FaHandHoldingUsd size = { 24 }
        /> <
        h1 > E - Tontine < /h1> <
        /div> <
        button className = "notif-btn" >
        <
        FaBell size = { 20 }
        /> <
        span className = "notif-badge" > 3 < /span> <
        /button> <
        /header>

        { /* Dashboard */ } <
        section className = "dashboard" >
        <
        div className = "welcome-banner" >
        <
        h2 > Bonjour, < span > Mohamed < /span> !</h
        2 >
        <
        p > Votre tontine en toute sécurité < /p> <
        /div>

        <
        div className = "stats-grid" >
        <
        StatCard icon = { < FaWallet / > }
        title = "Solde"
        value = "125,000 FCFA" / >
        <
        StatCard icon = { < FaCalendarAlt / > }
        title = "Prochain tour"
        value = "15 Jours"
        highlight / >
        <
        StatCard icon = { < FaUsers / > }
        title = "Membres"
        value = "8/10" / >
        <
        StatCard icon = { < FaCoins / > }
        title = "Cotisation"
        value = "25,000 FCFA" / >
        <
        /div> <
        /section>

        { /* Quick Actions */ } <
        section className = "quick-actions" >
        <
        h2 > Actions Rapides < /h2> <
        div className = "action-buttons" >
        <
        ActionButton icon = { < FaMoneyBillWave / > }
        label = "Payer"
        onClick = {
            () => setShowPaymentModal(true) }
        /> <
        ActionButton icon = { < FaHistory / > }
        label = "Historique" / >
        <
        ActionButton icon = { < FaUsers / > }
        label = "Groupe" / >
        <
        ActionButton icon = { < FaCog / > }
        label = "Paramètres" / >
        <
        /div> <
        /section>

        { /* Recent Activity */ } <
        section className = "recent-activity" >
        <
        h2 > Activité Récente < FaChevronRight / > < /h2> <
        ul className = "activity-list" >
        <
        ActivityItem icon = { < FaCheckCircle className = "success" / > }
        title = "Paiement reçu - Fatou"
        time = "Aujourd'hui, 10:45"
        amount = "+25,000 FCFA" / >
        <
        ActivityItem icon = { < FaExclamationCircle className = "warning" / > }
        title = "Rappel - Jean n'a pas payé"
        time = "Hier, 16:30" / >
        <
        ActivityItem icon = { < FaInfoCircle className = "info" / > }
        title = "Tour attribué à Aïcha"
        time = "05/06/2024"
        amount = "50,000 FCFA"
        highlight / >
        <
        /ul> <
        /section>

        { /* Navigation */ } <
        nav className = "bottom-nav" >
        <
        NavItem icon = { < FaHome / > }
        label = "Accueil"
        active / >
        <
        NavItem icon = { < FaChartPie / > }
        label = "Stats" / >
        <
        NavItem icon = { < FaComments / > }
        label = "Chat" / >
        <
        NavItem icon = { < FaUser / > }
        label = "Profil" / >
        <
        /nav>

        { /* Payment Modal */ } {
            showPaymentModal && ( <
                div className = "modal" >
                <
                div className = "modal-content" >
                <
                span className = "close-modal"
                onClick = {
                    () => setShowPaymentModal(false) } > & times; < /span> <
                h2 > Effectuer un Paiement < /h2> <
                form onSubmit = { handlePaymentSubmit } >
                <
                div className = "form-group" >
                <
                label htmlFor = "amount" > Montant(FCFA) < /label> <
                input type = "number"
                id = "amount"
                value = { paymentAmount }
                onChange = {
                    (e) => setPaymentAmount(e.target.value) }
                required /
                >
                <
                /div> <
                button type = "submit"
                className = "submit-btn" > Confirmer < /button> <
                /form> <
                /div> <
                /div>
            )
        } <
        /div>
    );
};

// Composants réutilisables
const StatCard = ({ icon, title, value, highlight }) => ( <
    div className = { `stat-card ${highlight ? 'highlight' : ''}` } >
    <
    div className = "stat-icon" > { icon } < /div> <
    h3 > { title } < /h3> <
    p className = { highlight ? 'highlight' : '' } > { value } < /p> <
    /div>
);

const ActionButton = ({ icon, label, onClick }) => ( <
    button className = "action-btn"
    onClick = { onClick } >
    <
    div className = "action-icon" > { icon } < /div> <
    span > { label } < /span> <
    /button>
);

const ActivityItem = ({ icon, title, time, amount, highlight }) => ( <
        li >
        <
        div className = "activity-icon" > { icon } < /div> <
        div className = "activity-details" >
        <
        p > { title } < /p> <
        small > { time } < /small> <
        /div> {
            amount && < span className = { `amount ${highlight ? 'highlight' : ''}` } > { amount } < /span>} <
                /li>
        );

        const NavItem = ({ icon, label, active }) => ( <
            a href = "#"
            className = { `nav-item ${active ? 'active' : ''}` } >
            <
            div className = "nav-icon" > { icon } < /div> <
            span > { label } < /span> <
            /a>
        );

        export default Home;