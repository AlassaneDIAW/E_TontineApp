import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSave,
    FaArrowLeft,
    FaUsers
} from 'react-icons/fa';
import api from '../services/api';
import './CreateTontine.css';

const CreateTontine = () => {
        const navigate = useNavigate();
        const [formData, setFormData] = useState({
            nom: '',
            description: '',
            montant: '',
            membres: '',
            date_debut: '',
            date_fin: '',
        });

        const [errors, setErrors] = useState({});
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [successMessage, setSuccessMessage] = useState('');

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({...formData, [name]: value });
            if (errors[name]) setErrors({...errors, [name]: null });
        };

        const validateForm = () => {
            const newErrors = {};
            if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
            if (!formData.montant) newErrors.montant = 'Le montant est requis';
            if (isNaN(formData.montant)) newErrors.montant = 'Le montant doit être un nombre';
            if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise';
            if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise';
            if (!formData.membres) newErrors.membres = 'Liste de membres requise';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async(e) => {
            e.preventDefault();
            if (!validateForm()) return;
            setIsSubmitting(true);

            try {
                const response = await api.post('/tontines', {
                    ...formData,
                    montant: parseFloat(formData.montant),
                });
                setSuccessMessage('Tontine créée avec succès!');
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (error) {
                setErrors({
                    ...errors,
                    server: error.response ? .data ? .error || 'Erreur serveur lors de la création'
                });
            } finally {
                setIsSubmitting(false);
            }
        };

        return ( <
                div className = "create-tontine-container" >
                <
                div className = "create-tontine-header" >
                <
                button className = "back-button"
                onClick = {
                    () => navigate('/dashboard') }
                type = "button" >
                <
                FaArrowLeft / > Retour <
                /button> <
                h1 > < FaUsers / > Créer une nouvelle tontine < /h1> <
                /div>

                {
                    successMessage && < div className = "success-message" > { successMessage } < /div>} {
                        errors.server && < div className = "error-message" > { errors.server } < /div>}

                        <
                        form onSubmit = { handleSubmit }
                        className = "tontine-form" >
                            <
                            input name = "nom"
                        value = { formData.nom }
                        onChange = { handleChange }
                        placeholder = "Nom de la tontine"
                        required / >
                            <
                            textarea name = "description"
                        value = { formData.description }
                        onChange = { handleChange }
                        placeholder = "Description"
                        rows = { 3 }
                        /> <
                        input name = "montant"
                        type = "number"
                        value = { formData.montant }
                        onChange = { handleChange }
                        placeholder = "Montant (FCFA)"
                        required / >
                            <
                            input name = "membres"
                        value = { formData.membres }
                        onChange = { handleChange }
                        placeholder = "Membres (séparés par des virgules)"
                        required / >
                            <
                            input name = "date_debut"
                        type = "date"
                        value = { formData.date_debut }
                        onChange = { handleChange }
                        required / >
                            <
                            input name = "date_fin"
                        type = "date"
                        value = { formData.date_fin }
                        onChange = { handleChange }
                        required / >
                            <
                            button type = "submit"
                        disabled = { isSubmitting } > < FaSave / > Créer < /button> <
                            /form> <
                            /div>
                    );
                };

                export default CreateTontine;