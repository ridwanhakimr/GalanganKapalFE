import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/ProtectedRoute';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ApprovalPage from './pages/ApprovalPage';
import AuditLogPage from './pages/AuditLogPage';
import MasterData from './pages/MasterData';
import StockLedger from './pages/StockLedger';

const Unauthorized = () => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="mt-2 text-gray-600">You don't have permission to view this page.</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes (Needs Login) */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Supervisor / Admin Only */}
          <Route element={<RoleBasedRoute allowedRoles={['Supervisor', 'Admin']} />}>
            <Route path="/approval" element={<ApprovalPage />} />
          </Route>
          
          {/* Admin Only */}
          <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/ledger" element={<StockLedger />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
