import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBillWave, FaUser, FaHandshake, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './TransactionStyles.css';

const CreateTransaction = () => {
    const [formData, setFormData] = useState({
        montant: '',
        tontineId: '',
        userId: '',
        type: 'cotisation',
        date: new Date().toISOString().split('T')[0]
    });
    
    const [tontines, setTontines] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tontinesRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5050/api/tontines'),
                    axios.get('http://localhost:5050/api/users')
                ]);
                setTontines(tontinesRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                setError('Erreur de chargement des données');
                console.error('Erreur lors du chargement:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Nettoyer l'erreur du champ modifié
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.montant || parseFloat(formData.montant) <= 0) {
            errors.montant = 'Le montant doit être supérieur à 0';
        }
        
        if (!formData.tontineId) {
            errors.tontineId = 'Veuillez sélectionner une tontine';
        }
        
        if (!formData.userId) {
            errors.userId = 'Veuillez sélectionner un membre';
        }
        
        if (!formData.date) {
            errors.date = 'La date est requise';
        }
        
        // Vérifier que la date n'est pas dans le futur
        const selectedDate = new Date(formData.date);
        const today = new Date();
        if (selectedDate > today) {
            errors.date = 'La date ne peut pas être dans le futur';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            await axios.post('http://localhost:5050/api/transactions', {
                ...formData,
                montant: parseFloat(formData.montant)
            });
            
            navigate('/dashboard', { 
                state: { success: 'Transaction créée avec succès!' } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la transaction');
            console.error('Erreur lors de la création:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FaSpinner className="spinner" />
                <p>Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="transaction-container">
            <div className="transaction-header">
                <button 
                    onClick={() => navigate(-1)}
                    className="back-button"
                    type="button"
                >
                    <FaArrowLeft /> Retour
                </button>
                <h1>
                    <FaMoneyBillWave /> Nouvelle Transaction
                </h1>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label htmlFor="type">Type de transaction</label>
                    <select 
                        id="type"
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className={fieldErrors.type ? 'error' : ''}
                        required
                    >
                        <option value="cotisation">Cotisation</option>
                        <option value="remboursement">Remboursement</option>
                        <option value="penalite">Pénalité</option>
                    </select>
                    {fieldErrors.type && (
                        <span className="field-error">{fieldErrors.type}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="montant">Montant (FCFA)</label>
                    <input 
                        id="montant"
                        type="number"
                        value={formData.montant}
                        onChange={(e) => handleInputChange('montant', e.target.value)}
                        min="0"
                        step="100"
                        placeholder="Entrez le montant"
                        className={fieldErrors.montant ? 'error' : ''}
                        required
                    />
                    {fieldErrors.montant && (
                        <span className="field-error">{fieldErrors.montant}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="tontineId">
                        <FaHandshake /> Tontine
                    </label>
                    <select 
                        id="tontineId"
                        value={formData.tontineId}
                        onChange={(e) => handleInputChange('tontineId', e.target.value)}
                        className={fieldErrors.tontineId ? 'error' : ''}
                        required
                    >
                        <option value="">Sélectionnez une tontine</option>
                        {tontines.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.nom} - {t.montant} FCFA
                            </option>
                        ))}
                    </select>
                    {fieldErrors.tontineId && (
                        <span className="field-error">{fieldErrors.tontineId}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="userId">
                        <FaUser /> Membre
                    </label>
                    <select 
                        id="userId"
                        value={formData.userId}
                        onChange={(e) => handleInputChange('userId', e.target.value)}
                        className={fieldErrors.userId ? 'error' : ''}
                        required
                    >
                        <option value="">Sélectionnez un membre</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.nom} ({u.email})
                            </option>
                        ))}
                    </select>
                    {fieldErrors.userId && (
                        <span className="field-error">{fieldErrors.userId}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input 
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={fieldErrors.date ? 'error' : ''}
                        required
                    />
                    {fieldErrors.date && (
                        <span className="field-error">{fieldErrors.date}</span>
                    )}
                </div>

                <div className="form-actions">
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cancel-button"
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit"
                        className="submit-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="spinner" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer la transaction'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTransaction;
