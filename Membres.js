import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './MemberStyles.css';

const Members = () => {
        const [members, setMembers] = useState([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
            const fetchMembers = async() => {
                try {
                    const response = await axios.get('http://localhost:5050/api/members');
                    setMembers(response.data);
                } catch (err) {
                    setError('Erreur de chargement des membres');
                } finally {
                    setLoading(false);
                }
            };
            fetchMembers();
        }, []);

        const handleDelete = async(id) => {
            if (window.confirm('Supprimer ce membre?')) {
                try {
                    await axios.delete(`http://localhost:5050/api/members/${id}`);
                    setMembers(members.filter(m => m.id !== id));
                } catch (err) {
                    setError('Échec de la suppression');
                }
            }
        };

        const filteredMembers = members.filter(member =>
            member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (loading) return <div className = "loading" > Chargement des membres... < /div>;

        return ( <
            div className = "members-container" >
            <
            div className = "members-header" >
            <
            h1 > < FaUserCircle / > Gestion des Membres < /h1>  <
            div className = "search-bar" >
            <
            FaSearch / >
            <
            input type = "text"
            placeholder = "Rechercher un membre..."
            value = { searchTerm }
            onChange = {
                (e) => setSearchTerm(e.target.value)
            }
            />  <
            /div>  <
            button className = "add-button" >
            <
            FaUserPlus / > Ajouter un membre < /button>  <
            /div>

            {
                error && < div className = "error-message" > { error } < /div>}

                <
                div className = "members-list" > {
                        filteredMembers.length === 0 ? ( <
                            p > Aucun membre trouvé < /p>
                        ) : ( <
                            table >
                            <
                            thead >
                            <
                            tr >
                            <
                            th > Nom < /th>  <
                            th > Email < /th> <
                            th > Téléphone < /th>  <
                            th > Tontines < /th>  <
                            th > Actions < /th> <
                            /tr>  <
                            /thead>  <
                            tbody > {
                                filteredMembers.map(member => ( <
                                    tr key = { member.id } >
                                    <
                                    td > { member.nom } < /td>  <
                                    td > { member.email } < /td>  <
                                    td > { member.telephone || 'N/A' } < /td>  <
                                    td > { member.tontines ? .length || 0 } < /td>  <
                                    td className = "actions" >
                                    <
                                    button className = "edit-btn" >
                                    <
                                    FaEdit / >
                                    <
                                    /button>  <
                                    button className = "delete-btn"
                                    onClick = {
                                        () => handleDelete(member.id)
                                    } >
                                    <
                                    FaTrash / >
                                    <
                                    /button>  <
                                    /td>  <
                                    /tr>
                                ))
                            } <
                            /tbody>  <
                            /table>
                        )
                    } <
                    /div>  <
                    /div>
            );
        };

        export default Members;