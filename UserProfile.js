import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../redux/slices/authSlice';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaEdit } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
        const dispatch = useDispatch();
        const { user } = useSelector(state => state.auth);
        const [editMode, setEditMode] = useState(false);
        const [formData, setFormData] = useState({
            nom: '',
            email: '',
            telephone: ''
        });

        useEffect(() => {
            dispatch(fetchUserProfile());
        }, [dispatch]);

        useEffect(() => {
            if (user) {
                setFormData({
                    nom: user.nom,
                    email: user.email,
                    telephone: user.telephone
                });
            }
        }, [user]);

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            dispatch(updateUserProfile(formData))
                .unwrap()
                .then(() => setEditMode(false));
        };

        return ( <
            div className = "profile-container" >
            <
            div className = "profile-header" >
            <
            h1 > Mon Profil < /h1> <
            button onClick = {
                () => setEditMode(!editMode) }
            className = "edit-button" > {
                editMode ? 'Annuler' : < > < FaEdit / > Modifier < />} <
                    /button> <
                    /div>

                    <
                    div className = "profile-content" >
                    <
                    div className = "avatar-section" >
                    <
                    img
                src = { user ? .avatar || '/default-avatar.png' }
                alt = "Avatar"
                className = "profile-avatar" /
                >
                <
                /div>

                <
                div className = "info-section" > {
                    editMode ? ( <
                        form onSubmit = { handleSubmit } >
                        <
                        div className = "form-group" >
                        <
                        label >
                        <
                        FaUser className = "input-icon" / >
                        Nom complet <
                        /label> <
                        input type = "text"
                        name = "nom"
                        value = { formData.nom }
                        onChange = { handleChange }
                        required /
                        >
                        <
                        /div>

                        <
                        div className = "form-group" >
                        <
                        label >
                        <
                        FaEnvelope className = "input-icon" / >
                        Email <
                        /label> <
                        input type = "email"
                        name = "email"
                        value = { formData.email }
                        onChange = { handleChange }
                        required /
                        >
                        <
                        /div>

                        <
                        div className = "form-group" >
                        <
                        label >
                        <
                        FaPhone className = "input-icon" / >
                        Téléphone <
                        /label> <
                        input type = "tel"
                        name = "telephone"
                        value = { formData.telephone }
                        onChange = { handleChange }
                        required /
                        >
                        <
                        /div>

                        <
                        button type = "submit"
                        className = "save-button" >
                        <
                        FaSave / > Enregistrer <
                        /button> <
                        /form>
                    ) : ( <
                        div className = "profile-info" >
                        <
                        div className = "info-item" >
                        <
                        FaUser className = "info-icon" / >
                        <
                        span > { user ? .nom } < /span> <
                        /div> <
                        div className = "info-item" >
                        <
                        FaEnvelope className = "info-icon" / >
                        <
                        span > { user ? .email } < /span> <
                        /div> <
                        div className = "info-item" >
                        <
                        FaPhone className = "info-icon" / >
                        <
                        span > { user ? .telephone || 'Non renseigné' } < /span> <
                        /div> <
                        /div>
                    )
                } <
                /div> <
                /div> <
                /div>
            );
        };

        export default UserProfile;