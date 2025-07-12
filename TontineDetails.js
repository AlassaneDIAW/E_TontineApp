import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTontineDetails } from '../redux/slices/tontineSlice';
import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import './TontineDetails.css';

const TontineDetails = () => {
        const { id } = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const { tontine, loading, error } = useSelector(state => state.tontine);
        const { user } = useSelector(state => state.auth);

        useEffect(() => {
            dispatch(fetchTontineDetails(id));
        }, [dispatch, id]);

        if (loading) return <div className = "loading" > Chargement... < /div>;
        if (error) return <div className = "error" > { error } < /div>;

        return ( <
            div className = "tontine-details-container" >
            <
            button onClick = {
                () => navigate(-1) }
            className = "back-button" >
            <
            FaArrowLeft / > Retour <
            /button>

            <
            div className = "tontine-header" >
            <
            h1 > { tontine ? .nom } < /h1> <
            span className = { `status-badge ${tontine?.statut}` } > { tontine ? .statut } < /span> <
            /div>

            <
            div className = "tontine-content" >
            <
            div className = "tontine-info" >
            <
            p className = "description" > { tontine ? .description } < /p>

            <
            div className = "details-grid" >
            <
            div className = "detail-card" >
            <
            FaMoneyBillWave className = "detail-icon" / >
            <
            h3 > Montant < /h3> <
            p > { tontine ? .montant }
            FCFA < /p> <
            /div>

            <
            div className = "detail-card" >
            <
            FaUsers className = "detail-icon" / >
            <
            h3 > Participants < /h3> <
            p > { tontine ? .membres ? .length || 0 }
            /{tontine?.nombreParticipants}</p >
            <
            /div>

            <
            div className = "detail-card" >
            <
            FaCalendarAlt className = "detail-icon" / >
            <
            h3 > Prochain tour < /h3> <
            p > { new Date(tontine ? .prochainTour).toLocaleDateString() } < /p> <
            /div> <
            /div> <
            /div>

            <
            div className = "tontine-members" >
            <
            h2 > Membres < /h2> <
            ul className = "members-list" > {
                tontine ? .membres ? .map(membre => ( <
                        li key = { membre._id }
                        className = { membre._id === user ? ._id ? 'current-user' : '' } >
                        <
                        img src = { membre.avatar || '/default-avatar.png' }
                        alt = { membre.nom }
                        className = "member-avatar" /
                        >
                        <
                        span > { membre.nom } < /span> {
                            membre._id === tontine ? .createur && < span className = "creator-badge" > Créateur < /span>} <
                                /li>
                        ))
                } <
                /ul> <
                /div> <
                /div> <
                /div>
            );
        };

        export default TontineDetails;