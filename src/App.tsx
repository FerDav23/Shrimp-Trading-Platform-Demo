import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

import { Login } from './pages/Login';
import { ProducerDashboard } from './pages/producer/ProducerDashboard';
import { ProducerOffers } from './pages/producer/ProducerOffers';
import { ProducerOfferDetail } from './pages/producer/ProducerOfferDetail';
import { ProducerSales } from './pages/producer/ProducerSales';
import { ProducerNewSale } from './pages/producer/ProducerNewSale';
import { ProducerProfile } from './pages/producer/ProducerProfile';
import { PackerDashboard } from './pages/packer/PackerDashboard';
import { PackerOffers } from './pages/packer/PackerOffers';
import { PackerSales } from './pages/packer/PackerSales';
import { PackerChat } from './pages/packer/PackerChat';
import { LogisticsDashboard } from './pages/logistics/LogisticsDashboard';
import { LogisticsShipments } from './pages/logistics/LogisticsShipments';
import { LogisticsPricing } from './pages/logistics/LogisticsPricing';
import { LogisticsCertificates } from './pages/logistics/LogisticsCertificates';
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { ManagerUsers } from './pages/manager/ManagerUsers';
import { ManagerOffers } from './pages/manager/ManagerOffers';
import { ManagerSales } from './pages/manager/ManagerSales';
import { ManagerApprovals } from './pages/manager/ManagerApprovals';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/producer/*"
            element={
              <ProtectedRoute allowedRoles={['PRODUCER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ProducerDashboard />} />
                    <Route path="offers" element={<ProducerOffers />} />
                    <Route path="offers/:id" element={<ProducerOfferDetail />} />
                    <Route path="sales" element={<ProducerSales />} />
                    <Route path="sales/new" element={<ProducerNewSale />} />
                    <Route path="profile" element={<ProducerProfile />} />
                    <Route path="*" element={<Navigate to="/producer/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/packer/*"
            element={
              <ProtectedRoute allowedRoles={['PACKER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<PackerDashboard />} />
                    <Route path="offers" element={<PackerOffers />} />
                    <Route path="sales" element={<PackerSales />} />
                    <Route path="sales/:statusFilter" element={<PackerSales />} />
                    <Route path="messages" element={<PackerChat />} />
                    <Route path="*" element={<Navigate to="/packer/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistics/*"
            element={
              <ProtectedRoute allowedRoles={['LOGISTICS']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<LogisticsDashboard />} />
                    <Route path="shipments" element={<LogisticsShipments />} />
                    <Route path="pricing" element={<LogisticsPricing />} />
                    <Route path="certificates" element={<LogisticsCertificates />} />
                    <Route path="*" element={<Navigate to="/logistics/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="users" element={<ManagerUsers />} />
                    <Route path="offers" element={<ManagerOffers />} />
                    <Route path="sales" element={<ManagerSales />} />
                    <Route path="approvals" element={<ManagerApprovals />} />
                    <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
