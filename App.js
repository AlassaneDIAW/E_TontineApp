import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const lazyRetry = (componentImport) =>
    lazy(async() => {
        try {
            return await componentImport();
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return componentImport();
        }
    });

// Lazy load des pages
const Home = lazyRetry(() =>
    import ('./pages/Home'));
const Login = lazyRetry(() =>
    import ('./pages/Login'));
const Register = lazyRetry(() =>
    import ('./pages/Register'));
const Dashboard = lazyRetry(() =>
    import ('./pages/Dashboard'));
const TontineList = lazyRetry(() =>
    import ('./pages/TontineList'));
const CreateTontine = lazyRetry(() =>
    import ('./pages/CreateTontine'));
const TontineDetails = lazyRetry(() =>
    import ('./pages/TontineDetails'));
const UserProfile = lazyRetry(() =>
    import ('./pages/UserProfile'));
const NotFound = lazyRetry(() =>
    import ('./pages/NotFound'));

const ROUTES = Object.freeze({
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    TONTINES: '/tontines',
    CREATE_TONTINE: '/create-tontine',
    PROFILE: '/profile'
});

function App() {
    return ( <
        Router >
        <
        div className = "app-container" >
        <
        ErrorBoundary >
        <
        ScrollToTop / >
        <
        Navbar / >
        <
        main className = "main-content" >
        <
        Suspense fallback = { < LoadingSpinner fullPage / > } >
        <
        Routes > { /* Public routes */ } <
        Route path = { ROUTES.HOME }
        element = { < Home / > }
        /> <
        Route path = { ROUTES.LOGIN }
        element = { < Login / > }
        /> <
        Route path = { ROUTES.REGISTER }
        element = { < Register / > }
        />

        { /* Protected routes */ } <
        Route element = { < PrivateRoute / > } >
        <
        Route path = { ROUTES.DASHBOARD }
        element = { < Dashboard / > }
        /> <
        Route path = { ROUTES.TONTINES }
        element = { < TontineList / > }
        /> <
        Route path = { `${ROUTES.TONTINES}/:id` }
        element = { < TontineDetails / > }
        /> <
        Route path = { ROUTES.CREATE_TONTINE }
        element = { < CreateTontine / > }
        /> <
        Route path = { ROUTES.PROFILE }
        element = { < UserProfile / > }
        /> <
        /Route>

        { /* 404 page */ } <
        Route path = "*"
        element = { < NotFound / > }
        /> <
        /Routes> <
        /Suspense> <
        /main> <
        Footer / >
        <
        /ErrorBoundary> <
        /div> <
        /Router>
    );
}

export default App;