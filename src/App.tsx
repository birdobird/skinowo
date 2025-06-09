import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import HowItWorks from './pages/HowItWorks';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Account from './pages/Account';
import TicketDetail from './pages/Support/TicketDetail';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import Admin from './pages/Admin';
import Dashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import UserDetails from './pages/Admin/UserDetails';
import Transactions from './pages/Admin/Transactions';
import TransactionDetails from './pages/Admin/TransactionDetails';
import Tickets from './pages/Admin/Tickets';
import TicketDetails from './pages/Admin/TicketDetails';
import SkinPrices from './pages/Admin/SkinPrices';
// Usunięto import Analytics

// Context
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';
import RefundPolicy from './pages/RefundPolicy';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="*" element={<NotFound/>} />
                <Route path="calculator" element={<Calculator />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="support" element={<Support />} />
                <Route path="support/ticket/:id" element={<TicketDetail />} />
                <Route path="terms" element={<Terms />} />
                <Route path="refund-policy" element={<RefundPolicy />} />
                <Route path="login" element={<Login />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="account/*" element={<Account />} />
                <Route path="auth/callback" element={<AuthCallback />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:id" element={<UserDetails />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transactions/:id" element={<TransactionDetails />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="tickets/:id" element={<TicketDetails />} />
                <Route path="skin-prices" element={<SkinPrices />} />
              </Route>
            </Routes>
            <ToastContainer position="bottom-right" theme="dark" />
          </BrowserRouter>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
