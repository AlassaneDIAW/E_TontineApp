import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Fonction utilitaire pour le lazy loading avec retry
const lazyRetry = (componentImport) =>
    lazy(async () => {
        try {
            return await componentImport();
        } catch (error) {
            // Retry après une seconde en cas d'échec
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return componentImport();
        }
    });

// Lazy loading des pages principales
const Home = lazyRetry(() => import('./pages/Home'));
const About = lazyRetry(() => import('./pages/About'));
const Contact = lazyRetry(() => import('./pages/Contact'));
const Features = lazyRetry(() => import('./pages/Features'));
const Pricing = lazyRetry(() => import('./pages/Pricing'));

// Pages d'authentification
const Login = lazyRetry(() => import('./pages/auth/Login'));
const Register = lazyRetry(() => import('./pages/auth/Register'));
const ForgotPassword = lazyRetry(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazyRetry(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazyRetry(() => import('./pages/auth/VerifyEmail'));

// Pages dashboard utilisateur
const Dashboard = lazyRetry(() => import('./pages/dashboard/Dashboard'));
const UserProfile = lazyRetry(() => import('./pages/dashboard/UserProfile'));
const Settings = lazyRetry(() => import('./pages/dashboard/Settings'));
const Notifications = lazyRetry(() => import('./pages/dashboard/Notifications'));

// Pages tontines
const TontineList = lazyRetry(() => import('./pages/tontines/TontineList'));
const TontineDetails = lazyRetry(() => import('./pages/tontines/TontineDetails'));
const CreateTontine = lazyRetry(() => import('./pages/tontines/CreateTontine'));
const EditTontine = lazyRetry(() => import('./pages/tontines/EditTontine'));
const JoinTontine = lazyRetry(() => import('./pages/tontines/JoinTontine'));
const MyTontines = lazyRetry(() => import('./pages/tontines/MyTontines'));

// Pages transactions
const Transactions = lazyRetry(() => import('./pages/transactions/Transactions'));
const TransactionDetails = lazyRetry(() => import('./pages/transactions/TransactionDetails'));
const PaymentHistory = lazyRetry(() => import('./pages/transactions/PaymentHistory'));
const Withdrawals = lazyRetry(() => import('./pages/transactions/Withdrawals'));

// Pages administrateur
const AdminDashboard = lazyRetry(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazyRetry(() => import('./pages/admin/AdminUsers'));
const AdminTontines = lazyRetry(() => import('./pages/admin/AdminTontines'));
const AdminTransactions = lazyRetry(() => import('./pages/admin/AdminTransactions'));
const AdminSettings = lazyRetry(() => import('./pages/admin/AdminSettings'));
const AdminReports = lazyRetry(() => import('./pages/admin/AdminReports'));

// Pages d'erreur
const NotFound = lazyRetry(() => import('./pages/errors/NotFound'));
const ServerError = lazyRetry(() => import('./pages/errors/ServerError'));
const Unauthorized = lazyRetry(() => import('./pages/errors/Unauthorized'));

// Configuration des routes
export const ROUTES = Object.freeze({
    // Routes publiques
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    FEATURES: '/features',
    PRICING: '/pricing',
    
    // Routes d'authentification
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    
    // Routes dashboard
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications',
    
    // Routes tontines
    TONTINES: '/tontines',
    TONTINE_DETAILS: '/tontines/:id',
    CREATE_TONTINE: '/create-tontine',
    EDIT_TONTINE: '/tontines/:id/edit',
    JOIN_TONTINE: '/tontines/:id/join',
    MY_TONTINES: '/my-tontines',
    
    // Routes transactions
    TRANSACTIONS: '/transactions',
    TRANSACTION_DETAILS: '/transactions/:id',
    PAYMENT_HISTORY: '/payments',
    WITHDRAWALS: '/withdrawals',
    
    // Routes administrateur
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_TONTINES: '/admin/tontines',
    ADMIN_TRANSACTIONS: '/admin/transactions',
    ADMIN_SETTINGS: '/admin/settings',
    ADMIN_REPORTS: '/admin/reports',
    
    // Routes d'erreur
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
    UNAUTHORIZED: '/unauthorized'
});

// Composant pour les routes administrateur
const AdminRoutes = () => (
    <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tontines" element={<AdminTontines />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="reports" element={<AdminReports />} />
    </Routes>
);

// Composant principal des routes
const AppRoutes = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner fullPage />}>
                <Routes>
                    {/* Routes publiques */}
                    <Route path={ROUTES.HOME} element={<Home />} />
                    <Route path={ROUTES.ABOUT} element={<About />} />
                    <Route path={ROUTES.CONTACT} element={<Contact />} />
                    <Route path={ROUTES.FEATURES} element={<Features />} />
                    <Route path={ROUTES.PRICING} element={<Pricing />} />
                    
                    {/* Routes d'authentification (accessible seulement si non connecté) */}
                    <Route element={<PublicRoute />}>
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                    </Route>
                    
                    {/* Routes protégées (nécessitent une authentification) */}
                    <Route element={<PrivateRoute />}>
                        {/* Dashboard utilisateur */}
                        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                        <Route path={ROUTES.PROFILE} element={<UserProfile />} />
                        <Route path={ROUTES.SETTINGS} element={<Settings />} />
                        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
                        
                        {/* Tontines */}
                        <Route path={ROUTES.TONTINES} element={<TontineList />} />
                        <Route path={ROUTES.TONTINE_DETAILS} element={<TontineDetails />} />
                        <Route path={ROUTES.CREATE_TONTINE} element={<CreateTontine />} />
                        <Route path={ROUTES.EDIT_TONTINE} element={<EditTontine />} />
                        <Route path={ROUTES.JOIN_TONTINE} element={<JoinTontine />} />
                        <Route path={ROUTES.MY_TONTINES} element={<MyTontines />} />
                        
                        {/* Transactions */}
                        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
                        <Route path={ROUTES.TRANSACTION_DETAILS} element={<TransactionDetails />} />
                        <Route path={ROUTES.PAYMENT_HISTORY} element={<PaymentHistory />} />
                        <Route path={ROUTES.WITHDRAWALS} element={<Withdrawals />} />
                        
                        {/* Routes administrateur (nécessitent un rôle admin) */}
                        <Route 
                            path="/admin/*" 
                            element={
                                <PrivateRoute requiredRole="admin">
                                    <AdminRoutes />
                                </PrivateRoute>
                            } 
                        />
                    </Route>
                    
                    {/* Routes d'erreur */}
                    <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                    <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />
                    <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
                    
                    {/* Redirections */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    
                    {/* Route 404 - doit être la dernière */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};

export default AppRoutes;
