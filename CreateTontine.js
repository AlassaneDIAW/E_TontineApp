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
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.montant) newErrors.montant = 'Le montant est requis';
        if (isNaN(formData.montant)) newErrors.montant = 'Le montant doit être un nombre';
        if (!formData.date_debut) newErrors.date_debut = 'La date de début est requise';
        if (!formData.date_fin) newErrors.date_fin = 'La date de fin est requise';
        if (!formData.membres) newErrors.membres = 'Liste de membres requise';
        
        // Validation des dates
        if (formData.date_debut && formData.date_fin) {
            const dateDebut = new Date(formData.date_debut);
            const dateFin = new Date(formData.date_fin);
            if (dateFin <= dateDebut) {
                newErrors.date_fin = 'La date de fin doit être après la date de début';
            }
        }
        
        // Validation du montant
        if (formData.montant && parseFloat(formData.montant) <= 0) {
            newErrors.montant = 'Le montant doit être supérieur à 0';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
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
                server: error.response?.data?.error || 'Erreur serveur lors de la création'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-tontine-container">
            <div className="create-tontine-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/dashboard')}
                    type="button"
                >
                    <FaArrowLeft /> Retour
                </button>
                <h1>
                    <FaUsers /> Créer une nouvelle tontine
                </h1>
            </div>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}
            
            {errors.server && (
                <div className="error-message">
                    {errors.server}
                </div>
            )}

            <form onSubmit={handleSubmit} className="tontine-form">
                <div className="form-group">
                    <label htmlFor="nom">Nom de la tontine *</label>
                    <input
                        id="nom"
                        name="nom"
                        type="text"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Nom de la tontine"
                        className={errors.nom ? 'error' : ''}
                        required
                    />
                    {errors.nom && <span className="field-error">{errors.nom}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description de la tontine"
                        rows={3}
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="field-error">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="montant">Montant (FCFA) *</label>
                    <input
                        id="montant"
                        name="montant"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.montant}
                        onChange={handleChange}
                        placeholder="Montant (FCFA)"
                        className={errors.montant ? 'error' : ''}
                        required
                    />
                    {errors.montant && <span className="field-error">{errors.montant}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="membres">Membres *</label>
                    <input
                        id="membres"
                        name="membres"
                        type="text"
                        value={formData.membres}
                        onChange={handleChange}
                        placeholder="Membres (séparés par des virgules)"
                        className={errors.membres ? 'error' : ''}
                        required
                    />
                    {errors.membres && <span className="field-error">{errors.membres}</span>}
                    <small className="field-help">
                        Entrez les noms des membres séparés par des virgules
                    </small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date_debut">Date de début *</label>
                        <input
                            id="date_debut"
                            name="date_debut"
                            type="date"
                            value={formData.date_debut}
                            onChange={handleChange}
                            className={errors.date_debut ? 'error' : ''}
                            required
                        />
                        {errors.date_debut && <span className="field-error">{errors.date_debut}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_fin">Date de fin *</label>
                        <input
                            id="date_fin"
                            name="date_fin"
                            type="date"
                            value={formData.date_fin}
                            onChange={handleChange}
                            className={errors.date_fin ? 'error' : ''}
                            required
                        />
                        {errors.date_fin && <span className="field-error">{errors.date_fin}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate('/dashboard')}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Création...
                            </>
                        ) : (
                            <>
                                <FaSave /> Créer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTontine;
