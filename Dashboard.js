import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaRegHandshake,
    FaUsers,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaSearch,
    FaBell,
    FaFilter,
    FaPlus,
    FaFileAlt,
    FaExchangeAlt,
    FaUserFriends
} from 'react-icons/fa';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('tontines');
    const [tontines, setTontines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalAmount: 0,
        activeMembers: 0,
        upcomingPayments: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [tontinesRes, statsRes] = await Promise.all([
                    api.get('/tontines'),
                    api.get('/stats')
                ]);

                setTontines(tontinesRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleNavigation = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    const filteredTontines = tontines.filter(tontine =>
        tontine.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Chargement en cours...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <div className="search-bar">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'tontines' ? 'active' : ''}`}
                    onClick={() => handleNavigation('tontines', '/tontines')}
                >
                    <FaRegHandshake /> Tontines
                </button>
                <button
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => handleNavigation('transactions', '/transactions')}
                >
                    <FaExchangeAlt /> Transactions
                </button>
                <button
                    className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => handleNavigation('members', '/members')}
                >
                    <FaUserFriends /> Membres
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => handleNavigation('reports', '/reports')}
                >
                    <FaFileAlt /> Rapports
                </button>
            </div>

            <div className="quick-actions">
                <button
                    className="action-btn"
                    onClick={() => navigate('/create')}
                >
                    <FaPlus /> Créer tontine
                </button>
                <button
                    className="action-btn"
                    onClick={() => navigate('/nouvelle-transaction')}
                >
                    <FaExchangeAlt /> Créer transaction
                </button>
            </div>

            <div className="stats-section">
                <div className="stat-card">
                    <FaUsers />
                    <h3>{stats.activeMembers}</h3>
                    <p>Membres actifs</p>
                </div>
                <div className="stat-card">
                    <FaRegHandshake />
                    <h3>{tontines.length}</h3>
                    <p>Tontines actives</p>
                </div>
                <div className="stat-card">
                    <FaMoneyBillWave />
                    <h3>{stats.totalAmount.toLocaleString()} FCFA</h3>
                    <p>Total collecté</p>
                </div>
            </div>

            {activeTab === 'tontines' && (
                <div className="content-section">
                    <h2>Vos Tontines</h2>
                    {filteredTontines.length === 0 ? (
                        <p>Aucune tontine trouvée</p>
                    ) : (
                        <div className="tontines-grid">
                            {filteredTontines.map(tontine => (
                                <div key={tontine.id} className="tontine-card">
                                    <h3>{tontine.nom}</h3>
                                    <p>Montant: {tontine.montant} FCFA</p>
                                    <button
                                        onClick={() => navigate(`/tontines/${tontine.id}`)}
                                        className="view-btn"
                                    >
                                        Voir détails
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="content-section">
                    <h2>Dernières Transactions</h2>
                    {/* Contenu des transactions */}
                </div>
            )}

            {activeTab === 'members' && (
                <div className="content-section">
                    <h2>Liste des Membres</h2>
                    {/* Contenu des membres */}
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="content-section">
                    <h2>Rapports</h2>
                    {/* Contenu des rapports */}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
