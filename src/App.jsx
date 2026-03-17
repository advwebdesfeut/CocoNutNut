import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp }   from './context/AppContext';
import Navbar                    from './components/Navbar';
import Footer                    from './components/Footer';
import ToastContainer            from './components/ToastContainer';
import HomePage                  from './pages/HomePage';
import LoginPage                 from './pages/LoginPage';
import RegisterPage              from './pages/RegisterPage';
import StorefrontPage            from './pages/StorefrontPage';
import ProductsPage              from './pages/ProductsPage';
import CartPage                  from './pages/CartPage';
import CheckoutPage              from './pages/CheckoutPage';
import TransactionHistoryPage    from './pages/TransactionHistoryPage';
import ProfilePage               from './pages/ProfilePage';

// Guard: redirect to /login if not authenticated
function PrivateRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

function AppShell() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content" id="main-content">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/storefront" element={<StorefrontPage />} />
          <Route path="/products"  element={<ProductsPage />} />
          <Route path="/cart"      element={<CartPage />} />
          <Route path="/checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/history"   element={<PrivateRoute><TransactionHistoryPage /></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
