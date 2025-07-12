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
    const [transactions, setTransactions] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                setLoading(true);
                setError(null);
                
                const [tontinesRes, statsRes, transactionsRes, membersRes] = await Promise.all([
                    api.get('/tontines').catch(err => ({ data: [] })),
                    api.get('/stats').catch(err => ({ data: { totalAmount: 0, activeMembers: 0, upcomingPayments: 0 } })),
                    api.get('/transactions').catch(err => ({ data: [] })),
                    api.get('/members').catch(err => ({ data: [] }))
                ]);

                setTontines(Array.isArray(tontinesRes.data) ? tontinesRes.data : []);
                setStats(statsRes.data || { totalAmount: 0, activeMembers: 0, upcomingPayments: 0 });
                setTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : []);
                setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Erreur lors du chargement des données. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleNavigation = (tab, path) => {
        setActiveTab(tab);
        if (path) {
            navigate(path);
        }
    };

    const handleCreateTontine = () => {
        navigate('/create');
    };

    const handleCreateTransaction = () => {
        navigate('/nouvelle-transaction');
    };

    const handleViewTontineDetails = (tontineId) => {
        navigate(`/tontines/${tontineId}`);
    };

    const filteredTontines = tontines.filter(tontine =>
        tontine?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount || 0);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="retry-btn"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Rechercher des tontines"
                    />
                </div>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'tontines' ? 'active' : ''}`}
                    onClick={() => handleNavigation('tontines')}
                    aria-label="Onglet Tontines"
                >
                    <FaRegHandshake /> Tontines
                </button>
                <button
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => handleNavigation('transactions')}
                    aria-label="Onglet Transactions"
                >
                    <FaExchangeAlt /> Transactions
                </button>
                <button
                    className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => handleNavigation('members')}
                    aria-label="Onglet Membres"
                >
                    <FaUserFriends /> Membres
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => handleNavigation('reports')}
                    aria-label="Onglet Rapports"
                >
                    <FaFileAlt /> Rapports
                </button>
            </div>

            <div className="quick-actions">
                <button
                    className="action-btn primary"
                    onClick={handleCreateTontine}
                    aria-label="Créer une nouvelle tontine"
                >
                    <FaPlus /> Créer tontine
                </button>
                <button
                    className="action-btn secondary"
                    onClick={handleCreateTransaction}
                    aria-label="Créer une nouvelle transaction"
                >
                    <FaExchangeAlt /> Créer transaction
                </button>
            </div>

            <div className="stats-section">
                <div className="stat-card">
                    <FaUsers className="stat-icon" />
                    <h3>{stats.activeMembers || 0}</h3>
                    <p>Membres actifs</p>
                </div>
                <div className="stat-card">
                    <FaRegHandshake className="stat-icon" />
                    <h3>{tontines.length}</h3>
                    <p>Tontines actives</p>
                </div>
                <div className="stat-card">
                    <FaMoneyBillWave className="stat-icon" />
                    <h3>{formatAmount(stats.totalAmount)} FCFA</h3>
                    <p>Total collecté</p>
                </div>
            </div>

            {activeTab === 'tontines' && (
                <div className="content-section">
                    <div className="section-header">
                        <h2>Vos Tontines</h2>
                        <span className="count">({filteredTontines.length})</span>
                    </div>
                    {filteredTontines.length === 0 ? (
                        <div className="empty-state">
                            <FaRegHandshake className="empty-icon" />
                            <p>Aucune tontine trouvée</p>
                            <button 
                                onClick={handleCreateTontine}
                                className="create-first-btn"
                            >
                                Créer votre première tontine
                            </button>
                        </div>
                    ) : (
                        <div className="tontines-grid">
                            {filteredTontines.map(tontine => (
                                <div key={tontine.id} className="tontine-card">
                                    <div className="card-header">
                                        <h3>{tontine.nom}</h3>
                                        <span className={`status ${tontine.status || 'active'}`}>
                                            {tontine.status || 'Active'}
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <p className="amount">
                                            <strong>{formatAmount(tontine.montant)} FCFA</strong>
                                        </p>
                                        <p className="members-count">
                                            {tontine.membersCount || 0} membres
                                        </p>
                                        <p className="next-payment">
                                            Prochain paiement: {tontine.nextPayment || 'À définir'}
                                        </p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            onClick={() => handleViewTontineDetails(tontine.id)}
                                            className="view-btn"
                                            aria-label={`Voir les détails de ${tontine.nom}`}
                                        >
                                            Voir détails
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="content-section">
                    <div className="section-header">
                        <h2>Dernières Transactions</h2>
                        <span className="count">({transactions.length})</span>
                    </div>
                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <FaExchangeAlt className="empty-icon" />
                            <p>Aucune transaction trouvée</p>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {transactions.slice(0, 10).map(transaction => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className="transaction-info">
                                        <h4>{transaction.description}</h4>
                                        <p className="transaction-date">
                                            {new Date(transaction.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <div className={`transaction-amount ${transaction.type}`}>
                                        {transaction.type === 'credit' ? '+' : '-'}
                                        {formatAmount(transaction.amount)} FCFA
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'members' && (
                <div className="content-section">
                    <div className="section-header">
                        <h2>Liste des Membres</h2>
                        <span className="count">({members.length})</span>
                    </div>
                    {members.length === 0 ? (
                        <div className="empty-state">
                            <FaUserFriends className="empty-icon" />
                            <p>Aucun membre trouvé</p>
                        </div>
                    ) : (
                        <div className="members-grid">
                            {members.map(member => (
                                <div key={member.id} className="member-card">
                                    <div className="member-avatar">
                                        {member.nom?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="member-info">
                                        <h4>{member.nom} {member.prenom}</h4>
                                        <p className="member-email">{member.email}</p>
                                        <p className="member-tontines">
                                            {member.tontinesCount || 0} tontine(s)
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="content-section">
                    <div className="section-header">
                        <h2>Rapports</h2>
                    </div>
                    <div className="reports-grid">
                        <div className="report-card">
                            <FaFileAlt className="report-icon" />
                            <h3>Rapport mensuel</h3>
                            <p>Résumé des activités du mois</p>
                            <button className="generate-btn">Générer</button>
                        </div>
                        <div className="report-card">
                            <FaMoneyBillWave className="report-icon" />
                            <h3>Rapport financier</h3>
                            <p>État des finances par tontine</p>
                            <button className="generate-btn">Générer</button>
                        </div>
                        <div className="report-card">
                            <FaUsers className="report-icon" />
                            <h3>Rapport membres</h3>
                            <p>Statistiques des membres actifs</p>
                            <button className="generate-btn">Générer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
