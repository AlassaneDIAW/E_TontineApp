import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock des composants pour éviter les erreurs de dépendances
jest.mock('./components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('./components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('./components/PrivateRoute', () => {
  return function MockPrivateRoute({ children }) {
    return <div data-testid="private-route">{children}</div>;
  };
});

jest.mock('./components/ScrollToTop', () => {
  return function MockScrollToTop() {
    return <div data-testid="scroll-to-top"></div>;
  };
});

jest.mock('./components/LoadingSpinner', () => {
  return function MockLoadingSpinner({ fullPage }) {
    return <div data-testid="loading-spinner" data-fullpage={fullPage}>Loading...</div>;
  };
});

jest.mock('./components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

// Mock des pages
jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./pages/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./pages/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('./pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-page">Dashboard Page</div>;
  };
});

jest.mock('./pages/TontineList', () => {
  return function MockTontineList() {
    return <div data-testid="tontine-list-page">Tontine List Page</div>;
  };
});

jest.mock('./pages/CreateTontine', () => {
  return function MockCreateTontine() {
    return <div data-testid="create-tontine-page">Create Tontine Page</div>;
  };
});

jest.mock('./pages/TontineDetails', () => {
  return function MockTontineDetails() {
    return <div data-testid="tontine-details-page">Tontine Details Page</div>;
  };
});

jest.mock('./pages/UserProfile', () => {
  return function MockUserProfile() {
    return <div data-testid="user-profile-page">User Profile Page</div>;
  };
});

jest.mock('./pages/NotFound', () => {
  return function MockNotFound() {
    return <div data-testid="not-found-page">Not Found Page</div>;
  };
});

// Mock du CSS
jest.mock('./App.css', () => ({}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<App />);
  });

  test('renders main app structure', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    renderWithRouter(<App />);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders login page when navigating to /login', () => {
    renderWithRouter(<App />, { route: '/login' });
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders register page when navigating to /register', () => {
    renderWithRouter(<App />, { route: '/register' });
    
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('has correct CSS class on main container', () => {
    renderWithRouter(<App />);
    
    const appContainer = screen.getByTestId('error-boundary').parentElement;
    expect(appContainer).toHaveClass('app-container');
  });

  test('has main content wrapper', () => {
    renderWithRouter(<App />);
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('main-content');
  });
});
