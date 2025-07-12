import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TontinesList.css'; // (optionnel si tu as du CSS)

const TontinesList = () => {
    const [tontines, setTontines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTontines = async() => {
            try {
                const response = await axios.get('http://localhost:5050/api/tontines');

                if (response.data.success) {
                    setTontines(response.data.data);
                } else {
                    setError(response.data.error || 'Erreur inconnue');
                }
            } catch (err) {
                setError(err.response ? .data ? .error || 'Erreur de connexion au serveur');
                console.error('Détails erreur:', err.response ? .data ? .details);
            } finally {
                setLoading(false);
            }
        };

        fetchTontines();
    }, []);

    if (loading) return <div className = "loading" > Chargement en cours... < /div>;
    if (error) return <div className = "error" > Erreur: { error } < /div>;

    return ( <
        div className = "tontines-container" >
        <
        h2 > Liste des Tontines < /h2>

        {
            tontines.length === 0 ? ( <
                p > Aucune tontine disponible < /p>
            ) : ( <
                table className = "tontines-table" >
                <
                thead >
                <
                tr >
                <
                th > Nom < /th> <
                th > Montant < /th> <
                th > Créateur < /th> <
                th > Membres < /th> <
                th > Statut < /th> <
                /tr> <
                /thead> <
                tbody > {
                    tontines.map((tontine) => ( <
                        tr key = { tontine.id } >
                        <
                        td > { tontine.nom } < /td> <
                        td > { tontine.montant }
                        FCFA < /td> <
                        td > { tontine.createur } < /td> <
                        td > { tontine.membres || 'Aucun' } < /td> <
                        td className = { `status-${tontine.statut}` } > { tontine.statut } < /td> <
                        /tr>
                    ))
                } <
                /tbody> <
                /table>
            )
        } <
        /div>
    );
};

export default TontinesList;