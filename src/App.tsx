import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Licenses } from './pages/Licenses';
import { LicenseGeneration } from './pages/LicenseGeneration';
import { LicenseActivation } from './pages/LicenseActivation';
import { Subscriptions } from './pages/Subscriptions';
import { Companies } from './pages/Companies';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/licenses/generate" element={<LicenseGeneration />} />
          <Route path="/licenses/activate" element={<LicenseActivation />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
