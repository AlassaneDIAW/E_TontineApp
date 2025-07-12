import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBillWave, FaUser, FaHandshake } from 'react-icons/fa';
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
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async() => {
            try {
                const [tontinesRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5050/api/tontines'),
                    axios.get('http://localhost:5050/api/users')
                ]);
                setTontines(tontinesRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                setError('Erreur de chargement des données');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5050/api/transactions', {
                ...formData,
                montant: parseFloat(formData.montant)
            });
            navigate('/dashboard', { state: { success: 'Transaction créée avec succès!' } });
        } catch (err) {
            setError(err.response ? .data ? .message || 'Erreur lors de la création');
        }
    };

    if (loading) return <div className = "loading" > Chargement... < /div>;

    return ( < div className = "transaction-container" >
        <
        button onClick = {
            () => navigate(-1)
        }
        className = "back-button" >
        <
        FaArrowLeft / > Retour < /button>

        <
        h1 > < FaMoneyBillWave / > Nouvelle Transaction < /h1>

        {
            error && < div className = "error-message" > { error } < /div>}

            <
            form onSubmit = { handleSubmit } >
                <
                div className = "form-group" >
                <
                label > Type de transaction < /label>  <
                select value = { formData.type }
            onChange = {
                (e) => setFormData({...formData, type: e.target.value })
            }
            required
                >
                <
                option value = "cotisation" > Cotisation < /option> <
            option value = "remboursement" > Remboursement < /option> <
            option value = "penalite" > Pénalité < /option>  <
                /select>  <
                /div>

            <
            div className = "form-group" >
                <
                label > Montant(FCFA) < /label>  <
                input type = "number"
            value = { formData.montant }
            onChange = {
                (e) => setFormData({...formData, montant: e.target.value })
            }
            min = "0"
            step = "100"
            required / >
                <
                /div>

            <
            div className = "form-group" >
                <
                label > < FaHandshake / > Tontine < /label>  <
                select value = { formData.tontineId }
            onChange = {
                (e) => setFormData({...formData, tontineId: e.target.value })
            }
            required >
                <
                option value = "" > Sélectionnez une tontine < /option> {
            tontines.map(t => ( <
                option key = { t.id }
                value = { t.id } > { t.nom } - { t.montant }
                FCFA <
                /option>
            ))
        } <
        /select>  <
        /div>

        <
        div className = "form-group" >
        <
        label > < FaUser / > Membre < /label> <
        select value = { formData.userId }
        onChange = {
            (e) => setFormData({...formData, userId: e.target.value })
        }
        required >
        <
        option value = "" > Sélectionnez un membre < /option> {
        users.map(u => ( <
            option key = { u.id }
            value = { u.id } > { u.nom }({ u.email }) < /option>
        ))
    }

    <
    /select>  <
    /div>

    <
    div className = "form-group" >
        <
        label > Date < /label> <input type = "date" value = { formData.date }
    onChange = {
        (e) => setFormData({...formData, date: e.target.value })
    }
    required / >
        <
        /div>

    <
    button type = "submit"
    className = "submit-button" >
        Enregistrer la transaction <
        /button>  <
        /form>  <
        /div>
);
};

export default CreateTransaction;