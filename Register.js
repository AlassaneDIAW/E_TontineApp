import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import './Register.css';

const Register = () => {
        const [formData, setFormData] = useState({
            nom: '',
            email: '',
            telephone: '',
            password: '',
            confirmPassword: ''
        });
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const { loading, error } = useSelector(state => state.auth);

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (formData.password !== formData.confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }
            dispatch(registerUser(formData))
                .unwrap()
                .then(() => navigate('/dashboard'))
                .catch(err => console.error(err));
        };

        return ( <
            div className = "register-container" >
            <
            div className = "register-card" >
            <
            div className = "register-header" >
            <
            FaUserPlus className = "register-icon" / >
            <
            h2 > Créer un compte < /h2>  <
            /div>

            {
                error && < div className = "error-message" > { error } < /div>}

                <
                form onSubmit = { handleSubmit } >
                    <
                    div className = "form-group" >
                    <
                    label htmlFor = "nom" >
                    <
                    FaUser className = "input-icon" / >
                    Nom complet < /label>  <
                    input type = "text"
                id = "nom"
                name = "nom"
                value = { formData.nom }
                onChange = { handleChange }
                required
                    /
                    >
                    <
                    /div>

                <
                div className = "form-group" >
                    <
                    label htmlFor = "email" >
                    <
                    FaEnvelope className = "input-icon" / > Email < /label>  <
                    input
                type = "email"
                id = "email"
                name = "email"
                value = { formData.email }
                onChange = { handleChange }
                required
                    /
                    >
                    <
                    /div>

                <
                div className = "form-group" >
                    <
                    label htmlFor = "telephone" >
                    <
                    FaPhone className = "input-icon" / >
                    Téléphone < /label> <input
                type = "tel"
                id = "telephone"
                name = "telephone"
                value = { formData.telephone }
                onChange = { handleChange }
                required / >
                    <
                    /div>

                <
                div className = "form-group" >
                    <
                    label htmlFor = "password" >
                    <
                    FaLock className = "input-icon" / > Mot de passe < /label>  <
                    input
                type = "password"
                id = "password"
                name = "password"
                value = { formData.password }
                onChange = { handleChange }
                required
                minLength = "6" / >
                    <
                    /div>

                <
                div className = "form-group" >
                    <
                    label htmlFor = "confirmPassword" >
                    <
                    FaLock className = "input-icon" / >
                    Confirmer le mot de passe < /label>  <
                    input
                type = "password"
                id = "confirmPassword"
                name = "confirmPassword"
                value = { formData.confirmPassword }
                onChange = { handleChange }
                required
                minLength = "6" / >
                    <
                    /div>

                <
                button type = "submit"
                disabled = { loading }
                className = "register-button" > { loading ? 'Inscription en cours...' : 'S\'inscrire' } <
                    /button>  <
                    /form>

                <
                div className = "register-footer" >
                    <
                    p > Déjà un compte ? < a href = "/login" > Se connecter < /a></p >
                    <
                    /div>  <
                    /div>  <
                    /div>
            );
        };

        export default Register;