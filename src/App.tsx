import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import HowItWorks from './pages/HowItWorks';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Inventory from './pages/Inventory';

// Context
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="support" element={<Support />} />
            <Route path="terms" element={<Terms />} />
            <Route path="login" element={<Login />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
